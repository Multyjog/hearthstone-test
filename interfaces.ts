export interface Card {
  cardId: string;
  cardSet: string;
  dbfId: number;
  health: number;
  img: string;
  locale: string;
  name: string;
  playerClass: string;
  type: string;

  attack?: number;
  cost?: number;
  elite?: boolean;
  text?: string;
}
