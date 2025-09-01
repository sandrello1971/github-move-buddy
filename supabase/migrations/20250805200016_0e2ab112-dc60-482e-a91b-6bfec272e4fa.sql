-- Aggiungere le categorie mancanti che sono referenziate nella homepage
INSERT INTO public.categories (name, slug, description) VALUES 
('Curiosità', 'curiosita', 'Scopri una varietà di articoli intriganti e informativi che stimolano la mente'),
('Cucina', 'cucina', 'Trova deliziose ricette e consigli culinari per arricchire la tua tavola'),
('Lifestyle', 'lifestyle', 'Consigli di moda, arredamento e benessere per migliorare la vita quotidiana'),
('Consigli', 'consigli', 'Suggerimenti pratici per migliorare diversi aspetti della vita quotidiana');