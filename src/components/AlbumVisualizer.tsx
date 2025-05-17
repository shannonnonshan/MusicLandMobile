import { motion } from 'framer-motion';


interface AlbumVisualizerProps {
  isPlaying: boolean;
}

const AlbumVisualizer: React.FC<AlbumVisualizerProps> = ({ isPlaying }) => {
  // Tạo mảng 12 thanh cho visualizer
  const bars = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex items-end justify-center h-16 space-x-1 mt-4">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="tw-visualizer-bar tw-w-2"
          initial={{ height: '10%' }}
          animate={
            isPlaying
              ? {
                  height: ['10%', `${Math.random() * 90 + 10}%`, '10%'],
                  transition: {
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                    delay: bar * 0.05,
                  },
                }
              : { height: '10%' }
          }
        />
      ))}
    </div>
  );
};

export default AlbumVisualizer;
