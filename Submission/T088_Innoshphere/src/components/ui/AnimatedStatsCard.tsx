import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  delay?: number;
}

export const AnimatedStatsCard: React.FC<AnimatedStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            animateCount();
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const animateCount = () => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.min(Math.floor(increment * currentStep), value));

      if (currentStep >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, duration / steps);
  };

  const getChangeColor = () => {
    switch (change?.type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card
      ref={cardRef}
      className={`
        transition-all duration-700 transform
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-8 opacity-0 scale-95'
        }
        hover:shadow-lg hover:scale-105
        group
      `}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
        <div className="
          p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 
          transition-all duration-300 group-hover:scale-110
        ">
          <Icon className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="
            text-2xl font-bold text-gray-900
            transition-all duration-500
            group-hover:text-blue-600
          ">
            {count.toLocaleString()}
          </div>
          {change && (
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center transition-colors ${getChangeColor()}`}>
                <span className="mr-1">
                  {change.type === 'positive' ? '↗' : change.type === 'negative' ? '↘' : '→'}
                </span>
                {change.value}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

