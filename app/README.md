# CineClue

## 설치 및 실행

1. 의존성 설치
```
npm install
```

2. 환경변수 설정
`.env.local.example` → `.env.local` 로 복사 후 Supabase 키 입력

3. 개발 서버 실행
```
npm run dev
```

브라우저에서 http://localhost:3000 접속

## Vercel 배포

1. https://vercel.com 가입 (GitHub 연동)
2. 프로젝트 폴더를 GitHub에 올리기
3. Vercel에서 Import → 환경변수 설정 → Deploy
