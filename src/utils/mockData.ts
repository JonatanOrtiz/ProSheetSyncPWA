/**
 * Mock data for development and testing
 * This file contains example data structures that match the expected Firebase responses
 */

import { ClientData } from '@/types';

export const mockClientData: ClientData = {
  clientEmail: 'cliente@exemplo.com',
  clientName: 'João Silva',
  totalSpreadsheets: 4,
  lastUpdated: new Date().toISOString(),
  professionals: [
    {
      professionalId: 'prof-1',
      professionalEmail: 'personal@exemplo.com',
      professionalName: 'Carlos Trainer',
      professionalPhoto: '',
      services: [
        {
          serviceId: 'service-1',
          serviceName: 'Treino Segunda/Quarta/Sexta',
          serviceType: 'personal',
          spreadsheets: [
            {
              sheetId: 'sheet-1',
              sheetUrl: 'https://docs.google.com/spreadsheets/...',
              sheetTitle: 'Treino ABC',
              rowCount: 20,
              createdAt: new Date(),
              data: [
                ['Exercício', 'Séries', 'Repetições', 'Descanso', 'Peso'],
                ['Segunda-feira', '', '', '', ''],
                ['Supino Reto', '4', '12', '60s', '40kg'],
                ['Supino Inclinado', '3', '12', '60s', '35kg'],
                ['Crucifixo', '3', '15', '45s', '15kg'],
                ['Tríceps Testa', '3', '12', '45s', '20kg'],
                ['Quarta-feira', '', '', '', ''],
                ['Agachamento', '4', '15', '90s', '60kg'],
                ['Leg Press', '3', '20', '60s', '100kg'],
                ['Cadeira Extensora', '3', '15', '45s', '40kg'],
                ['Cadeira Flexora', '3', '15', '45s', '35kg'],
                ['Sexta-feira', '', '', '', ''],
                ['Remada Curvada', '4', '12', '60s', '40kg'],
                ['Pulldown', '3', '12', '60s', '50kg'],
                ['Rosca Direta', '3', '12', '45s', '15kg'],
                ['Rosca Martelo', '3', '12', '45s', '12kg']
              ]
            }
          ]
        }
      ]
    },
    {
      professionalId: 'prof-2',
      professionalEmail: 'nutri@exemplo.com',
      professionalName: 'Maria Nutricionista',
      professionalPhoto: '',
      services: [
        {
          serviceId: 'service-2',
          serviceName: 'Plano Alimentar Semanal',
          serviceType: 'nutricao',
          spreadsheets: [
            {
              sheetId: 'sheet-2',
              sheetUrl: 'https://docs.google.com/spreadsheets/...',
              sheetTitle: 'Dieta - Semana 1',
              rowCount: 15,
              createdAt: new Date(),
              data: [
                ['Refeição', 'Alimento', 'Quantidade', 'Calorias', 'Proteína', 'Carboidrato', 'Gordura'],
                ['Café da Manhã', 'Ovos Mexidos', '3 unidades', '210', '18g', '2g', '15g'],
                ['Café da Manhã', 'Pão Integral', '2 fatias', '140', '6g', '24g', '2g'],
                ['Café da Manhã', 'Abacate', '1/2 unidade', '120', '1.5g', '6g', '11g'],
                ['Lanche da Manhã', 'Iogurte Grego', '200ml', '130', '10g', '9g', '5g'],
                ['Lanche da Manhã', 'Banana', '1 unidade', '105', '1.3g', '27g', '0.4g'],
                ['Almoço', 'Frango Grelhado', '150g', '165', '31g', '0g', '3.6g'],
                ['Almoço', 'Arroz Integral', '150g', '170', '4g', '36g', '1.5g'],
                ['Almoço', 'Feijão', '100g', '130', '8g', '23g', '0.5g'],
                ['Almoço', 'Salada', '100g', '25', '1g', '5g', '0g'],
                ['Lanche da Tarde', 'Whey Protein', '30g', '120', '24g', '3g', '1.5g'],
                ['Lanche da Tarde', 'Castanhas', '30g', '180', '4g', '6g', '17g'],
                ['Jantar', 'Salmão', '150g', '280', '30g', '0g', '17g'],
                ['Jantar', 'Batata Doce', '150g', '130', '2g', '30g', '0g'],
                ['Jantar', 'Brócolis', '100g', '35', '3g', '7g', '0.4g']
              ]
            }
          ]
        }
      ]
    },
    {
      professionalId: 'prof-3',
      professionalEmail: 'coach@exemplo.com',
      professionalName: 'Pedro Coach',
      professionalPhoto: '',
      services: [
        {
          serviceId: 'service-3',
          serviceName: 'Metas 2024',
          serviceType: 'coach',
          spreadsheets: [
            {
              sheetId: 'sheet-3',
              sheetUrl: 'https://docs.google.com/spreadsheets/...',
              sheetTitle: 'Acompanhamento Mensal',
              rowCount: 5,
              createdAt: new Date(),
              data: [
                ['Meta', 'Descrição', 'Valor Alvo', 'Valor Atual', 'Progresso (%)', 'Prazo'],
                ['Perder Peso', 'Reduzir peso corporal', '70kg', '75kg', '50', '31/12/2024'],
                ['Ganhar Massa', 'Aumentar massa muscular', '5kg', '2kg', '40', '31/12/2024'],
                ['Corrida 5km', 'Correr 5km em menos de 30min', '30min', '35min', '70', '30/06/2024'],
                ['Flexibilidade', 'Tocar os pés sem dobrar joelhos', 'Sim', 'Quase', '80', '30/09/2024']
              ]
            }
          ]
        }
      ]
    }
  ]
};

/**
 * Use this function to simulate Firebase Cloud Function calls during development
 */
export const getMockClientData = async (): Promise<ClientData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockClientData;
};
