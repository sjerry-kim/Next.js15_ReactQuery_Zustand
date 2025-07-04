// import NextAuth, { DefaultSession, DefaultUser } from "next-_auth";
// import { DefaultJWT } from "next-_auth/jwt";
import { Role } from "@/_auth/auth-config";
import { ReactElement } from 'react';
import { SvgIconProps } from '@mui/material'; // 2단계에서 만들 Role 타입을 import

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       accessToken?: string;
//       refreshToken?: string;
//       role?: string;
//     };
//   }
//
//   interface User {
//     id: string;
//     role?: string;
//   }
// }
//
// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     accessToken?: string;
//     refreshToken?: string;
//     role?: string;
//   }
// }

export type Role = typeof ROLES[keyof typeof ROLES];

// 메뉴 아이템에 대한 인터페이스(타입) 정의
export interface SubMenu {
  idx: number;
  title: string;
  path: string;
  roles: Role[];
}

export interface Menu {
  idx: number;
  title: string;
  icon?: ReactElement<SvgIconProps>;
  roles: Role[];
  path: string;
  children?: SubMenu[];
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: unknown;
}