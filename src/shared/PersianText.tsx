// components/PersianText.tsx
import React, { type ReactNode } from 'react';
import { toPersianDigits } from '../hooks/pubFunc/formatNumber';

const VOID_ELEMENTS = new Set<string>([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function transformNode(node: ReactNode): ReactNode {
  if (node === null || node === undefined || typeof node === 'boolean') return node;

  if (typeof node === 'string' || typeof node === 'number') {
    return toPersianDigits(String(node));
  }

  if (Array.isArray(node)) {
    return node.map((n) => transformNode(n));
  }

  if (React.isValidElement(node)) {
    const { type, props } = node;

    if (typeof type === 'string' && VOID_ELEMENTS.has(type)) {
      return node;
    }

    if (props && typeof props === 'object' && 'dangerouslySetInnerHTML' in props) {
      return node;
    }

    const newChildren = transformNode((props as any)?.children);
    
    // فقط props شیء را spread کن
    const validProps = typeof props === 'object' && props !== null ? props : {};
    
    return React.cloneElement(node, { ...validProps }, newChildren);
  }

  return node;
}

interface PersianDigitsProps {
  children?: ReactNode;
}

export default function PersianDigits({ children }: PersianDigitsProps) {
  return <>{transformNode(children)}</>;
}