import { User } from 'lucide-react';
import { motion } from 'motion/react';

interface UserSelectorProps {
  onSelectUser: (user: 'Enzo' | 'Laura') => void;
}

export function UserSelector({ onSelectUser }: UserSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-700 via-red-600 to-green-700 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-white mb-12">
          🎄 ¡Bienvenido a la Lista de Regalos Navideña! 🎄
        </h1>
        
        <p className="text-white mb-8">
          ¿Quién está entrando?
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          {/* Enzo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectUser('Enzo')}
            className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-red-500/50 transition-all cursor-pointer flex flex-col items-center gap-4 w-64"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-20 h-20 text-white" strokeWidth={2} />
              </div>
              {/* Gorro navideño */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-16 h-16 bg-red-600 rounded-t-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-white"></div>
                </div>
              </div>
            </div>
            <span className="text-gray-800">Enzo</span>
          </motion.button>

          {/* Laura */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectUser('Laura')}
            className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-green-500/50 transition-all cursor-pointer flex flex-col items-center gap-4 w-64"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                <User className="w-20 h-20 text-white" strokeWidth={2} />
              </div>
              {/* Gorro navideño */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-16 h-16 bg-red-600 rounded-t-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-white"></div>
                </div>
              </div>
            </div>
            <span className="text-gray-800">Laura</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
