import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitTracker = (pagePath: string) => {
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [todayVisits, setTodayVisits] = useState<number>(0);

  useEffect(() => {
    // Genera un session ID unico per questa sessione del browser
    const getSessionId = () => {
      let sessionId = sessionStorage.getItem('visit_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('visit_session_id', sessionId);
      }
      return sessionId;
    };

    // Traccia la visita
    const trackVisit = async () => {
      try {
        const sessionId = getSessionId();
        
        // Registra la visita
        await supabase.from('site_visits').insert({
          page_path: pagePath,
          session_id: sessionId,
          user_agent: navigator.userAgent
        });

        // Aggiorna i contatori
        await updateVisitCounts();
      } catch (error) {
        console.error('Errore nel tracciare la visita:', error);
      }
    };

    // Aggiorna i contatori di visite
    const updateVisitCounts = async () => {
      try {
        const { data: totalData } = await supabase.rpc('get_total_visits');
        const { data: todayData } = await supabase.rpc('get_today_visits');
        
        setTotalVisits(totalData || 0);
        setTodayVisits(todayData || 0);
      } catch (error) {
        console.error('Errore nel recuperare i contatori:', error);
      }
    };

    trackVisit();
  }, [pagePath]);

  return { totalVisits, todayVisits };
};