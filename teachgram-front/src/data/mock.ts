import type { User as AuthUser } from '../models/User'
import type { Post, User } from '../types'

export type FriendStatus = 'online' | 'busy' | 'studying'

export interface FriendProfile {
  id: number
  name: string
  username: string
  bio: string
  course: string
  status: FriendStatus
  mutualFriends: number
  avatarSeed: string
}

export interface HighlightCard {
  label: string
  value: string
  description: string
  tone: 'warm' | 'soft' | 'rose' | 'amber'
}

export interface NotificationItem {
  id: number
  title: string
  description: string
  time: string
  tone: 'comment' | 'like' | 'follow' | 'announcement'
}

export const currentUserMock: AuthUser = {
  id: 1,
  name: 'Maria Eduarda',
  username: 'eduarda.m',
  email: 'maria@teachgram.app',
  phone: '+55 (11) 98888-1024',
  bio: 'Professora de tecnologia e criadora de conteúdo sobre aprendizagem ativa.',
  profileLink: '',
}

const authorList: User[] = [
  {
    id: 2,
    name: 'Ana Clara',
    username: 'anaclara.dev',
    email: 'ana@teachgram.app',
    phone: '+55 (11) 97777-2211',
    bio: 'Mentora de projetos e laboratórios criativos.',
    profileLink: '',
    createdAt: '2024-03-20T13:00:00.000Z',
    updatedAt: '2024-03-20T13:00:00.000Z',
    deleted: false,
  },
  {
    id: 3,
    name: 'Bruno Lima',
    username: 'brunolima',
    email: 'bruno@teachgram.app',
    phone: '+55 (11) 96666-1099',
    bio: 'Estudante de pedagogia e design de experiências.',
    profileLink: '',
    createdAt: '2024-04-02T09:00:00.000Z',
    updatedAt: '2024-04-02T09:00:00.000Z',
    deleted: false,
  },
  {
    id: 4,
    name: 'Camila Rocha',
    username: 'camilarocha',
    email: 'camila@teachgram.app',
    phone: '+55 (11) 95555-1010',
    bio: 'Pesquisadora em educação digital e cultura colaborativa.',
    profileLink: '',
    createdAt: '2024-05-17T17:30:00.000Z',
    updatedAt: '2024-05-17T17:30:00.000Z',
    deleted: false,
  },
]

export const feedPosts: Post[] = [
  {
    id: 1,
    title: 'Planejamento da semana com projeto mão na massa',
    description:
      'Organizei a turma em times, defini metas curtas e deixei checkpoints visuais para ninguém se perder no processo.',
    photoLink: '',
    videoLink: '',
    isPrivate: false,
    likesCount: 132,
    createdAt: '2024-08-15T15:30:00.000Z',
    updatedAt: '2024-08-15T15:30:00.000Z',
    deleted: false,
    user: authorList[0],
  },
  {
    id: 2,
    title: 'Ideias para engajamento em aulas híbridas',
    description:
      'Montei um conjunto de rituais rápidos para abrir a aula com energia e manter o chat ativo sem dispersar a turma.',
    photoLink: '',
    videoLink: '',
    isPrivate: false,
    likesCount: 86,
    createdAt: '2024-08-12T11:20:00.000Z',
    updatedAt: '2024-08-12T11:20:00.000Z',
    deleted: false,
    user: authorList[1],
  },
  {
    id: 3,
    title: 'Checklist de revisão para apresentação final',
    description:
      'Compartilhei um checklist com critérios claros, tempo estimado e feedback em dupla para melhorar a entrega final.',
    photoLink: '',
    videoLink: '',
    isPrivate: true,
    likesCount: 54,
    createdAt: '2024-08-08T09:45:00.000Z',
    updatedAt: '2024-08-08T09:45:00.000Z',
    deleted: false,
    user: authorList[2],
  },
]

export const highlightCards: HighlightCard[] = [
  {
    label: 'Atividades concluídas',
    value: '128',
    description: 'tarefas compartilhadas neste mês',
    tone: 'warm',
  },
  {
    label: 'Amigos ativos',
    value: '42',
    description: 'conectados no último dia',
    tone: 'soft',
  },
  {
    label: 'Curtidas',
    value: '2.4k',
    description: 'interações acumuladas',
    tone: 'rose',
  },
  {
    label: 'Novas ideias',
    value: '18',
    description: 'publicações salvas para depois',
    tone: 'amber',
  },
]

export const friendSuggestions: FriendProfile[] = [
  {
    id: 1,
    name: 'Lívia Martins',
    username: '@liviam',
    bio: 'Cria oficinas de leitura e experiências participativas.',
    course: 'Licenciatura em Letras',
    status: 'online',
    mutualFriends: 24,
    avatarSeed: 'livia',
  },
  {
    id: 2,
    name: 'Pedro Nogueira',
    username: '@pedron',
    bio: 'Constrói trilhas de aprendizagem com foco em autonomia.',
    course: 'Pedagogia Digital',
    status: 'studying',
    mutualFriends: 11,
    avatarSeed: 'pedro',
  },
  {
    id: 3,
    name: 'Juliana Costa',
    username: '@ju.costa',
    bio: 'Compartilha experiências com avaliação formativa.',
    course: 'Mestrado em Educação',
    status: 'busy',
    mutualFriends: 17,
    avatarSeed: 'ju',
  },
  {
    id: 4,
    name: 'Rafael Souza',
    username: '@rafaels',
    bio: 'Ama aprender por projetos e guiar comunidades de estudo.',
    course: 'Design Instrucional',
    status: 'online',
    mutualFriends: 8,
    avatarSeed: 'rafael',
  },
]

export const notifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Nova resposta no seu post',
    description: 'Ana Clara comentou sobre o roteiro da aula híbrida.',
    time: 'há 5 min',
    tone: 'comment',
  },
  {
    id: 2,
    title: '15 pessoas curtiram sua publicação',
    description: 'O checklist de revisão está ganhando destaque hoje.',
    time: 'há 22 min',
    tone: 'like',
  },
  {
    id: 3,
    title: 'Convite para colaborar em projeto',
    description: 'Camila Rocha quer dividir a curadoria de conteúdos.',
    time: 'há 1 hora',
    tone: 'follow',
  },
  {
    id: 4,
    title: 'Atualização da comunidade Teachgram',
    description: 'Nova trilha para professores iniciantes já está disponível.',
    time: 'ontem',
    tone: 'announcement',
  },
]

export const teachingTips = [
  'Planeje o próximo passo visível para manter a turma envolvida.',
  'Use micro-recados no feed para estimular colaboração.',
  'Convide amigos para revisar atividades em dupla.',
]

export const profileBadges = [
  'Mentora da semana',
  'Criadora ativa',
  'Top colaboradora',
]
