import React from 'react';

interface EmojiFollowerProps {
  emoji: string;
  position: { x: number; y: number };
}

const EmojiFollower: React.FC<EmojiFollowerProps> = ({ emoji, position }) => {
  return (
    <div
      className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="text-3xl animate-bounce drop-shadow-lg">
        {emoji}
      </div>
      <div className="absolute inset-0 text-3xl animate-ping opacity-30">
        {emoji}
      </div>
    </div>
  );
};

export default EmojiFollower;