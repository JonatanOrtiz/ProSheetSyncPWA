import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { ClientData } from '@/types';

export const useClientData = () => {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Usar getClientDataByEmail - busca dados do cliente autenticado
      const getClientDataByEmail = httpsCallable(functions, 'getClientDataByEmail');
      const result = await getClientDataByEmail();

      // A resposta vem com { success, clientEmail, clientName, professionals, totalSpreadsheets, lastUpdated }
      const responseData = result.data as any;

      // Transformar para o formato ClientData esperado
      const clientData: ClientData = {
        clientEmail: responseData.clientEmail,
        clientName: responseData.clientName,
        totalSpreadsheets: responseData.totalSpreadsheets,
        professionals: responseData.professionals,
        lastUpdated: responseData.lastUpdated
      };

      setData(clientData);
    } catch (err: any) {
      console.error('Error fetching client data:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
