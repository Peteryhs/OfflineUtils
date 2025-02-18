import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideIn: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const expandSection: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1, 
    transition: { 
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2, delay: 0.1 }
    } 
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    } 
  }
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};