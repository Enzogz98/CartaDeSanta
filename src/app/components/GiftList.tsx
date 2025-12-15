import { useState, useEffect } from 'react';
import { Gift, Sparkles, ArrowLeft, Plus, Trash2, List, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Definimos la estructura basada en tu tabla SQL
interface GiftItem {
  id: number;
  nomRegalo: string;
  persona: string;
}

interface GiftListProps {
  currentUser: 'Enzo' | 'Laura';
  onBack: () => void;
}

export function GiftList({ currentUser, onBack }: GiftListProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [newGift, setNewGift] = useState('');
  
  // Loading general (para la carga inicial)
  const [loading, setLoading] = useState(false);
  // Loading específico para cuando agregamos (bloquea el input y botón)
  const [isAdding, setIsAdding] = useState(false);
  
  const [myGifts, setMyGifts] = useState<GiftItem[]>([]);
  const [otherGifts, setOtherGifts] = useState<GiftItem[]>([]);

  const otherUser = currentUser === 'Enzo' ? 'Laura' : 'Enzo';
  const API_URL = '/api/regalos';

  // --- 1. QUERY (GET) ---
  const fetchGifts = async () => {
    setLoading(true);
    try {
      const myRes = await fetch(`${API_URL}?persona=${currentUser}`);
      const myData = await myRes.json();
      setMyGifts(Array.isArray(myData) ? myData : []);

      const otherRes = await fetch(`${API_URL}?persona=${otherUser}`);
      const otherData = await otherRes.json();
      setOtherGifts(Array.isArray(otherData) ? otherData : []);
    } catch (error) {
      console.error("Error haciendo la query:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, [currentUser]);

  // --- 2. POST (INSERT) ---
  const addGift = async () => {
    if (newGift.trim() === '') return;
    
    // 1. Bloqueamos la UI
    setIsAdding(true);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nomRegalo: newGift.trim(), 
          persona: currentUser 
        })
      });
      
      if (response.ok) {
        setNewGift('');
        // Esperamos a que se refresquen los datos antes de desbloquear
        await fetchGifts(); 
      }
    } catch (error) {
      console.error("Error en el POST:", error);
    } finally {
      // 2. Desbloqueamos la UI (pase lo que pase)
      setIsAdding(false);
    }
  };

  // --- 3. DELETE (DELETE BY ID) ---
  const removeGift = async (id: number) => {
    // Optimistic Update: Lo borramos de la vista inmediatamente para que se sienta rápido
    // Si falla la petición, podrías revertirlo, pero para este caso simple está bien.
    const previousGifts = [...myGifts];
    setMyGifts(prev => prev.filter(g => g.id !== id));

    try {
      const response = await fetch(`${API_URL}?id=${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        // Si falló, revertimos el cambio
        setMyGifts(previousGifts);
        console.error("Error al borrar en el servidor");
      }
    } catch (error) {
      setMyGifts(previousGifts);
      console.error("Error en el DELETE:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAdding) addGift();
  };

  // Lógica del sorteo
  const selectRandomGift = () => {
    if (otherGifts.length === 0) return;
    setIsAnimating(true);
    setSelectedGift(null);

    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * otherGifts.length);
      setSelectedGift(otherGifts[randomIndex].nomRegalo);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 via-red-600 to-red-700 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            // Deshabilitamos el volver si está cargando para evitar estados inconsistentes
            disabled={isAdding} 
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-white mb-2 font-bold text-3xl">
              ¡Hola {currentUser}! 🎅
            </h1>
            {loading && !isAdding && (
              <p className="text-white/80 animate-pulse flex justify-center gap-2 items-center">
                <Loader2 className="w-4 h-4 animate-spin"/> Conectando con el Polo Norte...
              </p>
            )}
          </div>
        </motion.div>

        <Tabs defaultValue="other" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/20">
            <TabsTrigger value="other" className="data-[state=active]:bg-white" disabled={isAdding}>
              <List className="w-4 h-4 mr-2" />
              Regalos de {otherUser}
            </TabsTrigger>
            <TabsTrigger value="my" className="data-[state=active]:bg-white" disabled={isAdding}>
              <Gift className="w-4 h-4 mr-2" />
              Mis Regalos
            </TabsTrigger>
          </TabsList>

          {/* Tab: Regalos del otro usuario */}
          <TabsContent value="other">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/95 backdrop-blur p-6 sm:p-8 text-center">
                <Gift className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h2 className="mb-4 text-xl font-bold">
                  🎲 Sorteo de Regalo para {otherUser}
                </h2>
                
                <Button
                  onClick={selectRandomGift}
                  disabled={isAnimating || otherGifts.length === 0}
                  className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-8 py-6 mb-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isAnimating ? 'Sorteando...' : 'Sortear Regalo'}
                </Button>

                <AnimatePresence mode="wait">
                  {selectedGift && !isAnimating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-6 border-4 border-yellow-400"
                    >
                      <p className="text-gray-600 mb-2 font-semibold">¡Regalo seleccionado!</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedGift}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 border-t pt-6">
                  <h3 className="text-sm text-gray-500 mb-4">Opciones disponibles en BD:</h3>
                  {otherGifts.length === 0 ? (
                    <p className="text-gray-400 italic">No hay regalos en la base de datos para {otherUser}.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {otherGifts.map((gift) => (
                        <span key={gift.id} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm border">
                          {gift.nomRegalo}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Tab: Mis regalos */}
          <TabsContent value="my">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/95 backdrop-blur p-6 sm:p-8">
                <h2 className="mb-6 text-center text-xl font-bold">
                  ✨ Gestiona tu carta a Santa
                </h2>
                
                {/* Formulario POST con Bloqueo Visual */}
                <div className="flex gap-2 mb-6">
                  <Input
                    type="text"
                    placeholder="Ej: 🎁 Nombre del regalo..."
                    value={newGift}
                    onChange={(e) => setNewGift(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isAdding} // SE BLOQUEA AL AGREGAR
                    className="flex-1"
                  />
                  <Button
                    onClick={addGift}
                    disabled={isAdding || newGift.trim() === ''} // SE BLOQUEA AL AGREGAR
                    className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 text-white min-w-[100px]"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar
                      </>
                    )}
                  </Button>
                </div>

                {/* Lista DELETE */}
                {myGifts.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Aún no has guardado regalos en la base de datos.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myGifts.map((gift) => (
                      <motion.div
                        key={gift.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-green-300 shadow-sm"
                      >
                        <p className="text-gray-800 flex-1 font-medium">{gift.nomRegalo}</p>
                        <Button
                          onClick={() => removeGift(gift.id)}
                          disabled={isAdding} // Opcional: Bloqueamos borrar mientras se agrega otro
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}