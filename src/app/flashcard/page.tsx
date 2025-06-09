'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Header from '../components/Header';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  lastReviewed?: Date;
  confidence: 1 | 2 | 3 | 4 | 5; // 1 = Not at all, 5 = Perfect
}

export default function FlashcardPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const expandSection = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }
  };

  const addCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      const newCard: Flashcard = {
        id: Date.now().toString(),
        front: newCardFront.trim(),
        back: newCardBack.trim(),
        confidence: 1
      };
      setCards([...cards, newCard]);
      setNewCardFront('');
      setNewCardBack('');
    }
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    if (currentCard >= cards.length - 1) {
      setCurrentCard(Math.max(0, cards.length - 2));
    }
  };

  const editCard = (id: string, front: string, back: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, front, back } : card
    ));
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <motion.div 
        className="max-w-4xl mx-auto pt-16"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6 bg-gray-900/50 backdrop-blur-xl border-gray-800">
          <h1 className="text-2xl font-semibold mb-6">Flashcards</h1>
          
          {/* Add new card form */}
          <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Front</label>
                <input
                  type="text"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the question or term"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Back</label>
                <input
                  type="text"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the answer or definition"
                />
              </div>
              <button
                onClick={addCard}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Add Card
              </button>
            </div>
          </div>

          {/* Flashcard display */}
          {cards.length > 0 ? (
            <div className="text-center">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentCard + (isFlipped ? '-flipped' : '')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md mx-auto h-64 cursor-pointer"
                  onClick={flipCard}
                  style={{ perspective: 1000 }}
                >
                  <div 
                    className="relative w-full h-full" 
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.4s',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    <div
                      className="absolute w-full h-full bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 flex items-center justify-center text-center border border-gray-700"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)'
                      }}
                    >
                      <p className="text-xl text-white">{cards[currentCard].front}</p>
                    </div>
                    <div
                      className="absolute w-full h-full bg-blue-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 flex items-center justify-center text-center border border-blue-700"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <p className="text-xl text-white">{cards[currentCard].back}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-8 space-y-4">
                <div className="w-full max-w-md mx-auto bg-gray-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    style={{
                      width: `${((currentCard + 1) / cards.length) * 100}%`
                    }}
                    initial={{ width: `${(currentCard / cards.length) * 100}%` }}
                    animate={{ width: `${((currentCard + 1) / cards.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Card {currentCard + 1} of {cards.length}
                </p>
                <button
                  onClick={nextCard}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Press space to continue
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              No flashcards yet. Add some cards to get started!
            </div>
          )}

          {/* Card Management Section */}
          <div className="mt-12 border border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('manage')}
              className="w-full p-4 text-left bg-gray-800/50 hover:bg-gray-800/70 flex justify-between items-center"
            >
              <h2 className="text-xl font-semibold">Manage Cards</h2>
              <span>{expandedSections['manage'] ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {expandedSections['manage'] && (
                <motion.div
                  variants={expandSection}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <Card key={card.id} className="bg-gray-800/50 border-gray-700">
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Front</label>
                      <input
                        type="text"
                        value={card.front}
                        onChange={(e) => editCard(card.id, e.target.value, card.back)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Back</label>
                      <input
                        type="text"
                        value={card.back}
                        onChange={(e) => editCard(card.id, card.front, e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Delete Card
                    </button>
                  </div>
                </Card>
              ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}