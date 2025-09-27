import { MockTimers } from "node:test";

export type CardType = 'pointage' | 'epargne' | 'offrant';
export type CardStatus = 'active' | 'paused' | 'completed' | 'interrupted';
export type TransactionType = 'deposit_main' | 'deposit_card' | 'withdraw_card' | 'withdraw_main' | 'commission';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  date: Date;
  time: MockTimers
  description: string;
  commission?: number;
}

export interface Card {
  id: string;
  type: CardType;
  name: string;
  status: CardStatus;
  createdAt: Date;
  balance: number;
  goal: number; // For pointage and epargne
  boxAmount?: number; // For pointage
  boxesFilled?: number; // For pointage
  transactions: Transaction[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  pin: string; // In a real app, this would be a hash
  avatar: string;
  createdAt: Date;
  mainAccountBalance: number;
  cards: Card[];
  transactions: Transaction[];
}
