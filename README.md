# The Plus Before & After

Google Sites로 관리하던 병원 Before & After 페이지를 Vercel 배포에 맞춘 React/Vite 앱으로 옮긴 초안입니다.

## 실행

```bash
npm install
npm run dev
```

로컬 주소는 기본적으로 `http://127.0.0.1:5173` 입니다.

## 빌드

```bash
npm run build
```

Vercel에서는 Framework Preset을 `Vite`로 선택하고 Build Command는 `npm run build`, Output Directory는 `dist`를 사용하면 됩니다.

## 관리자 데모

상단 `Admin` 버튼으로 이동합니다.

Supabase를 연결하지 않은 로컬 데모에서는 아래 비밀번호를 사용합니다.

데모 비밀번호:

```text
theplus2026
```

Supabase를 연결하면 관리자 로그인은 Supabase Auth의 이메일/비밀번호 계정을 사용합니다.

## Supabase 연결

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 [supabase-schema.sql](./supabase-schema.sql)을 실행합니다.
3. Authentication > Users에서 관리자 이메일 계정을 만듭니다.
4. 이 프로젝트의 `.env` 파일을 만들고 [.env.example](./.env.example)을 참고해 값을 넣습니다.

```bash
cp .env.example .env
```

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
VITE_SUPABASE_CASES_TABLE=cases
VITE_SUPABASE_STORAGE_BUCKET=case-images
```

`VITE_SUPABASE_ANON_KEY`에는 Supabase Project Settings > API에 있는 anon 또는 publishable key를 넣습니다. `service_role` key는 브라우저 앱에 넣으면 안 됩니다.

5. 개발 서버를 다시 시작합니다.

```bash
npm run dev
```

이후 관리자 페이지에서 Before/After 이미지를 파일로 직접 선택해 Supabase Storage에 업로드할 수 있습니다.

현재 Supabase를 연결하지 않은 상태에서는 관리자 데이터가 브라우저 `localStorage`에 저장됩니다.

## Vercel 환경 변수

Vercel에 배포할 때는 Project Settings > Environment Variables에 아래 값을 똑같이 추가합니다.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_CASES_TABLE`
- `VITE_SUPABASE_STORAGE_BUCKET`

환경 변수를 추가하거나 바꾼 뒤에는 Vercel에서 다시 배포해야 반영됩니다.

## 운영판에서 붙이면 좋은 기능

- 관리자 계정 인증
- 환자 동의 여부와 비공개/공개 상태 관리
- 이미지 업로드 및 WebP 변환
- 의사/시술/국가/언어별 공개 범위
- 상담 링크, WhatsApp/Kakao/LINE 문의 버튼
- 개인정보 및 의료광고 심의 문구
