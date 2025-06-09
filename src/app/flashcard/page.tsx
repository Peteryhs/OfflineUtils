'use client';

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Updated Card imports
import { Button } from '@/components/ui/button'; // Added Button import
import { Input } from '@/components/ui/input'; // Added Input import
import { useToast } from '@/components/ui/use-toast'; // Added useToast import
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
  const { toast } = useToast(); // Initialized useToast

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
      toast({ // Added success toast for adding card
        title: "Card Added",
        description: "New flashcard has been successfully created.",
      });
    }
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    if (currentCard >= cards.length - 1 && cards.length > 1) { // check cards.length > 1
      setCurrentCard(Math.max(0, cards.length - 2));
    } else if (cards.length <= 1) { // if only one card was left or no cards
      setCurrentCard(0);
      setIsFlipped(false); // Reset flip state if no cards or one card left
    }
    toast({ // Added toast for deleting card
      title: "Card Deleted",
      description: "The flashcard has been removed.",
    });
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
        <Card className="p-6"> {/* Removed redundant styling from main Card */}
          <h1 className="text-2xl font-semibold mb-6">Flashcards</h1>
          
          {/* Add new card form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="newCardFront" className="block text-sm font-medium text-muted-foreground mb-1">Front</label>
                <Input
                  id="newCardFront"
                  type="text"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  placeholder="Enter the question or term"
                />
              </div>
              <div>
                <label htmlFor="newCardBack" className="block text-sm font-medium text-muted-foreground mb-1">Back</label>
                <Input
                  id="newCardBack"
                  type="text"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  placeholder="Enter the answer or definition"
                />
              </div>
              <Button onClick={addCard}>
                Add Card
              </Button>
            </CardContent>
          </Card>

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
                <p className="text-muted-foreground text-sm">
                  Card {currentCard + 1} of {cards.length}
                </p>
                <Button
                  onClick={nextCard}
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Press space to continue
                </Button>
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
                      <Card key={card.id}> {/* Standardized Card styling */}
                        <CardContent className="p-4 space-y-4 pt-6"> {/* Added pt-6 to CardContent for padding */}
                          <div>
                            <label htmlFor={`front-${card.id}`} className="block text-sm font-medium text-muted-foreground mb-1">Front</label>
                            <Input
                              id={`front-${card.id}`}
                              type="text"
                              value={card.front}
                              onChange={(e) => editCard(card.id, e.target.value, card.back)}
                            />
                          </div>
                          <div>
                            <label htmlFor={`back-${card.id}`} className="block text-sm font-medium text-muted-foreground mb-1">Back</label>
                            <Input
                              id={`back-${card.id}`}
                              type="text"
                              value={card.back}
                              onChange={(e) => editCard(card.id, card.front, e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={() => deleteCard(card.id)}
                            variant="destructive"
                            className="w-full"
                          >
                            Delete Card
                          </Button>
                        </CardContent>
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