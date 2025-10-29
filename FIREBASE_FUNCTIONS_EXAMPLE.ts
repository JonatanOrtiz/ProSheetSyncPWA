/**
 * ADICIONE ESTAS FUNCTIONS NO SEU PROJETO FIREBASE (mesmo do dashboard)
 * Localização: functions/src/index.ts (ou criar arquivo separado)
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Se ainda não inicializou o admin, faça aqui
// (só uma vez no arquivo)
// admin.initializeApp();

/**
 * Function: getClientData
 *
 * Retorna todos os dados do cliente autenticado.
 * Chamada pelo PWA quando o usuário abre o app.
 */
export const getClientData = functions
  .region('southamerica-east1')
  .https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuário não autenticado'
      );
    }

    const clientUid = context.auth.uid;

    try {
      // Buscar dados do cliente no Firestore
      const clientDoc = await admin
        .firestore()
        .collection('clients')
        .doc(clientUid)
        .get();

      if (!clientDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Dados do cliente não encontrados'
        );
      }

      const clientData = clientDoc.data();

      // Estrutura esperada pelo PWA:
      // {
      //   clientEmail: string;
      //   clientName: string;
      //   totalSpreadsheets: number;
      //   lastUpdated: string;
      //   professionals: [
      //     {
      //       professionalId: string;
      //       professionalEmail: string;
      //       professionalName: string;
      //       professionalPhoto?: string;
      //       services: [
      //         {
      //           serviceId: string;
      //           serviceName: string;
      //           serviceType: 'personal' | 'nutricao' | 'coach' | 'other';
      //           spreadsheets: [
      //             {
      //               sheetId: string;
      //               sheetUrl: string;
      //               sheetTitle: string;
      //               rowCount: number;
      //               createdAt: Timestamp;
      //               data: any[][];  // Dados da planilha
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // }

      return clientData;
    } catch (error) {
      console.error('Error getting client data:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao buscar dados do cliente'
      );
    }
  });

/**
 * Function: refreshService (OPCIONAL)
 *
 * Atualiza os dados de um serviço específico.
 * Útil quando o usuário quer forçar atualização de dados.
 */
export const refreshService = functions
  .region('southamerica-east1')
  .https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuário não autenticado'
      );
    }

    const { serviceId } = data;

    if (!serviceId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'serviceId é obrigatório'
      );
    }

    const clientUid = context.auth.uid;

    try {
      // Buscar dados atuais do cliente
      const clientDoc = await admin
        .firestore()
        .collection('clients')
        .doc(clientUid)
        .get();

      if (!clientDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Cliente não encontrado'
        );
      }

      const clientData = clientDoc.data();

      // Encontrar o serviço
      let targetService = null;
      for (const professional of clientData?.professionals || []) {
        const service = professional.services?.find((s: any) => s.serviceId === serviceId);
        if (service) {
          targetService = service;
          break;
        }
      }

      if (!targetService) {
        throw new functions.https.HttpsError(
          'not-found',
          'Serviço não encontrado'
        );
      }

      // AQUI: Você implementaria a lógica para buscar dados atualizados
      // do Google Sheets e atualizar o Firestore
      // Exemplo:
      // 1. Pegar os spreadsheets do targetService
      // 2. Buscar dados atualizados do Google Sheets API
      // 3. Atualizar no Firestore
      // 4. Retornar dados atualizados

      // Por enquanto, apenas retorna o serviço atual
      return targetService;
    } catch (error) {
      console.error('Error refreshing service:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao atualizar serviço'
      );
    }
  });

/**
 * IMPORTANTE: Deploy das functions
 *
 * 1. Navegue até a pasta functions do seu projeto:
 *    cd functions
 *
 * 2. Instale dependências (se necessário):
 *    npm install
 *
 * 3. Build:
 *    npm run build
 *
 * 4. Deploy:
 *    firebase deploy --only functions:getClientData,functions:refreshService
 *
 * Ou deploy todas:
 *    firebase deploy --only functions
 */
