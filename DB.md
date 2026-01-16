-- ============================================
-- 운동기록 웹사이트 - Supabase DB 설계
-- 버전: 2.0 (유저 입력 기반 운동 종목)
-- ============================================

-- ============================================
-- 설계 원칙
-- ============================================
-- 1. 운동 카테고리: 고정값 (시스템 정의) - 등/가슴/다리/상체/하체/어깨/유산소
-- 2. 운동 종목: 유저가 직접 입력 (자유 입력)
-- 3. 향후 유사 이름 매칭 알고리즘 확장 가능한 구조
-- 4. 세트 정보: 일반 운동 - 무게(선택)/횟수(필수), 유산소 - 거리(선택)/시간(필수)

-- ============================================
-- 유저 워크플로우
-- ============================================
-- Step 1: 날짜 선택
--     ↓
-- Step 2: 부위 선택 (10개 카테고리)
--     ├─ 세분화: 등, 가슴, 어깨, 이두, 삼두, 다리, 복근
--     ├─ 통합: 상체, 하체
--     └─ 유산소
--     ↓
-- Step 3: 종목 입력 (자유 입력, 예: "벤치프레스", "풀업")
--     ↓
-- Step 4: 세트 정보 입력
--     ├─ 일반 운동: 무게(선택), 횟수(필수)
--     └─ 유산소: 거리(선택), 시간(필수)
--     ↓
-- Step 5: 저장 (한 종목씩 저장, 다음 종목은 Step 1부터)

-- ============================================
-- 1. Users 테이블
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  language VARCHAR(5) DEFAULT 'ja',  -- 기본값: 일본어 (ja, ko, en)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Exercise Categories 테이블 (고정 카테고리)
-- ============================================
CREATE TABLE exercise_categories (
  id VARCHAR(20) PRIMARY KEY,
  name_ja VARCHAR(50) NOT NULL,
  name_ko VARCHAR(50) NOT NULL,
  name_en VARCHAR(50) NOT NULL,
  is_cardio BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- 초기 데이터 (10개 고정 카테고리)
-- 세분화된 부위 + 통합 옵션 (상체/하체) 제공
INSERT INTO exercise_categories (id, name_ja, name_ko, name_en, is_cardio, sort_order) VALUES
  -- 세분화된 부위
  ('back', '背中', '등', 'Back', FALSE, 1),
  ('chest', '胸', '가슴', 'Chest', FALSE, 2),
  ('shoulder', '肩', '어깨', 'Shoulder', FALSE, 3),
  ('biceps', '二頭筋', '이두', 'Biceps', FALSE, 4),
  ('triceps', '三頭筋', '삼두', 'Triceps', FALSE, 5),
  ('legs', '脚', '다리', 'Legs', FALSE, 6),
  ('core', '体幹', '복근', 'Core', FALSE, 7),
  -- 통합 옵션 (구분하고 싶지 않은 사용자용)
  ('upper_body', '上半身', '상체', 'Upper Body', FALSE, 8),
  ('lower_body', '下半身', '하체', 'Lower Body', FALSE, 9),
  -- 유산소
  ('cardio', '有酸素', '유산소', 'Cardio', TRUE, 10);

-- ============================================
-- 3. User Exercises 테이블 (유저가 직접 입력한 운동 종목)
-- ============================================
CREATE TABLE user_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(20) NOT NULL REFERENCES exercise_categories(id),
  name VARCHAR(100) NOT NULL,
  normalized_name VARCHAR(100),  -- 정규화된 이름 (향후 유사 매칭용)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- 같은 유저, 같은 카테고리에서 중복 방지
  UNIQUE(user_id, category_id, name)
);

-- 인덱스 (유사 이름 검색용)
CREATE INDEX idx_user_exercises_user ON user_exercises(user_id);
CREATE INDEX idx_user_exercises_category ON user_exercises(category_id);
CREATE INDEX idx_user_exercises_normalized ON user_exercises(user_id, normalized_name);

-- ============================================
-- 4. Workout Sessions 테이블 (운동 날짜/세션)
-- ============================================
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- 같은 유저, 같은 날짜에 하나의 세션만
  UNIQUE(user_id, date)
);
-- 메모는 daily_memos 테이블에서 통합 관리

-- 인덱스
CREATE INDEX idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(date);

-- ============================================
-- 5. Workout Records 테이블 (세션 내 운동 기록)
-- ============================================
CREATE TABLE workout_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES user_exercises(id),
  sort_order INT DEFAULT 0,  -- 운동 순서
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_workout_records_session ON workout_records(session_id);

-- ============================================
-- 6. Workout Sets 테이블 (세트 정보)
-- ============================================
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES workout_records(id) ON DELETE CASCADE,
  set_number INT NOT NULL,

  -- 일반 운동용
  weight DECIMAL(6,2),    -- kg (선택, 풀업 등은 NULL)
  reps INT,               -- 횟수 (일반 운동시 필수)

  -- 유산소용
  distance DECIMAL(6,2),  -- km (선택, 버피 등은 NULL)
  duration INT,           -- 시간 (초, 유산소시 필수)

  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_workout_sets_record ON workout_sets(record_id);

-- ============================================
-- 7. Daily Memos 테이블 (날짜별 메모)
-- ============================================
-- 운동 기록과 별개로 매일 메모를 작성 가능
-- 상세 메모 뷰에서 사용 (휴식일 메모, 컨디션 기록 등)
CREATE TABLE daily_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- 같은 유저, 같은 날짜에 하나의 메모만
  UNIQUE(user_id, date)
);

-- 인덱스
CREATE INDEX idx_daily_memos_user ON daily_memos(user_id);
CREATE INDEX idx_daily_memos_date ON daily_memos(user_id, date);

-- ============================================
-- 향후 확장: 유사 이름 매칭 테이블
-- ============================================
-- Phase 1: normalized_name 필드 활용 (공백 제거, 소문자 변환)
-- Phase 2: 아래 테이블로 유저가 직접 그룹핑
-- Phase 3: AI 기반 자동 매칭 추천

-- CREATE TABLE exercise_aliases (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   canonical_exercise_id UUID NOT NULL REFERENCES user_exercises(id),
--   alias_exercise_id UUID NOT NULL REFERENCES user_exercises(id),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- 예: "벤치프레스", "벤치 프레스", "벤프" → 하나의 canonical로 연결

-- ============================================
-- Row Level Security (RLS) 설정
-- ============================================

-- Users 테이블
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Exercise Categories (공개 - 모두 읽기 가능)
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public"
  ON exercise_categories FOR SELECT
  USING (true);

-- User Exercises
ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercises"
  ON user_exercises FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own exercises"
  ON user_exercises FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own exercises"
  ON user_exercises FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own exercises"
  ON user_exercises FOR DELETE
  USING (user_id = auth.uid());

-- Workout Sessions
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON workout_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON workout_sessions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON workout_sessions FOR DELETE
  USING (user_id = auth.uid());

-- Workout Records
ALTER TABLE workout_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records"
  ON workout_records FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM workout_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own records"
  ON workout_records FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM workout_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own records"
  ON workout_records FOR UPDATE
  USING (
    session_id IN (
      SELECT id FROM workout_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own records"
  ON workout_records FOR DELETE
  USING (
    session_id IN (
      SELECT id FROM workout_sessions WHERE user_id = auth.uid()
    )
  );

-- Workout Sets
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sets"
  ON workout_sets FOR SELECT
  USING (
    record_id IN (
      SELECT id FROM workout_records
      WHERE session_id IN (
        SELECT id FROM workout_sessions WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own sets"
  ON workout_sets FOR INSERT
  WITH CHECK (
    record_id IN (
      SELECT id FROM workout_records
      WHERE session_id IN (
        SELECT id FROM workout_sessions WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update own sets"
  ON workout_sets FOR UPDATE
  USING (
    record_id IN (
      SELECT id FROM workout_records
      WHERE session_id IN (
        SELECT id FROM workout_sessions WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete own sets"
  ON workout_sets FOR DELETE
  USING (
    record_id IN (
      SELECT id FROM workout_records
      WHERE session_id IN (
        SELECT id FROM workout_sessions WHERE user_id = auth.uid()
      )
    )
  );

-- Daily Memos
ALTER TABLE daily_memos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memos"
  ON daily_memos FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own memos"
  ON daily_memos FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own memos"
  ON daily_memos FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own memos"
  ON daily_memos FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- ERD (Entity Relationship Diagram)
-- ============================================
--
-- ┌─────────────────┐
-- │     users       │
-- ├─────────────────┤
-- │ id (PK)         │
-- │ email           │
-- │ name            │
-- │ language (ja)   │───────────────────────────────────┐
-- └─────────────────┘                                   │
--         │                                             │
--         ├─────────────────────────────┐               │
--         │ 1:N                         │ 1:N           │
--         ▼                             ▼               │
-- ┌─────────────────┐           ┌─────────────────┐     │
-- │  daily_memos    │           │                 │     │
-- ├─────────────────┤           │                 │     │
-- │ id (PK)         │           │                 │     │
-- │ user_id (FK)    │           │                 │     │
-- │ date            │           │                 │     │
-- │ content         │           │                 │     │
-- └─────────────────┘           │                 │     │
--                               ▼                 │     │
-- ┌─────────────────┐     N:1    ┌────────────────────┐ │
-- │ user_exercises  │───────────▶│exercise_categories │ │
-- ├─────────────────┤            ├────────────────────┤ │
-- │ id (PK)         │            │ id (PK)            │ │
-- │ user_id (FK)    │            │ name_ja/ko/en      │ │
-- │ category_id(FK) │            │ is_cardio          │ │
-- │ name (유저입력)   │            └────────────────────┘ │
-- │ normalized_name │                                   │
-- └─────────────────┘                                   │
--         │                                             │
--         │ 1:N                                         │
--         ▼                                             │
-- ┌─────────────────┐     N:1    ┌────────────────────┐ │
-- │ workout_records │───────────▶│ workout_sessions   │◀┘
-- ├─────────────────┤            ├────────────────────┤
-- │ id (PK)         │            │ id (PK)            │
-- │ session_id (FK) │            │ user_id (FK)       │
-- │ exercise_id(FK) │            │ date               │
-- │ sort_order      │            └────────────────────┘
-- └─────────────────┘
--         │
--         │ 1:N
--         ▼
-- ┌─────────────────┐
-- │  workout_sets   │
-- ├─────────────────┤
-- │ id (PK)         │
-- │ record_id (FK)  │
-- │ set_number      │
-- │ weight (선택)   │  ← 일반 운동
-- │ reps (필수)     │  ← 일반 운동
-- │ distance (선택) │  ← 유산소
-- │ duration (필수) │  ← 유산소
-- └─────────────────┘

-- ============================================
-- 데이터 흐름 예시
-- ============================================

-- 예시 1: 가슴 운동 (벤치프레스 3세트)
--
-- 1. 날짜 선택: 2025-01-14
-- INSERT INTO workout_sessions (id, user_id, date)
-- VALUES ('session-1', 'user-1', '2025-01-14');
--
-- 2. 카테고리: 가슴 (chest) → 종목 입력: "벤치프레스"
-- INSERT INTO user_exercises (id, user_id, category_id, name, normalized_name)
-- VALUES ('exercise-1', 'user-1', 'chest', '벤치프레스', 'benchpress');
--
-- 3. 운동 기록 생성
-- INSERT INTO workout_records (id, session_id, exercise_id, sort_order)
-- VALUES ('record-1', 'session-1', 'exercise-1', 1);
--
-- 4. 세트 입력 (무게는 선택, 횟수는 필수)
-- INSERT INTO workout_sets (record_id, set_number, weight, reps) VALUES
--   ('record-1', 1, 60, 10),   -- 60kg x 10회
--   ('record-1', 2, 70, 8),    -- 70kg x 8회
--   ('record-1', 3, 80, 6);    -- 80kg x 6회

-- 예시 2: 등 운동 (풀업 - 무게 없음)
-- INSERT INTO workout_sets (record_id, set_number, weight, reps) VALUES
--   ('record-2', 1, NULL, 10),  -- 자체체중 x 10회
--   ('record-2', 2, NULL, 8),   -- 자체체중 x 8회
--   ('record-2', 3, NULL, 6);   -- 자체체중 x 6회

-- 예시 3: 유산소 (러닝 - 거리/시간)
-- INSERT INTO user_exercises (id, user_id, category_id, name)
-- VALUES ('exercise-3', 'user-1', 'cardio', '러닝');
--
-- INSERT INTO workout_sets (record_id, set_number, distance, duration) VALUES
--   ('record-3', 1, 5.0, 1800);  -- 5km, 30분(1800초)

-- 예시 4: 유산소 (버피 - 거리 없음, 시간만)
-- INSERT INTO workout_sets (record_id, set_number, distance, duration) VALUES
--   ('record-4', 1, NULL, 600);  -- 10분(600초)

-- ============================================
-- 테이블 요약
-- ============================================
-- | 테이블명           | 설명                    | 데이터 소스   |
-- |--------------------|-------------------------|---------------|
-- | users              | 사용자 정보             | 시스템/유저   |
-- | exercise_categories| 운동 카테고리 (10개)    | 시스템 (고정) |
-- | user_exercises     | 유저 운동 종목          | 유저 입력     |
-- | workout_sessions   | 운동 세션 (날짜별)      | 유저 입력     |
-- | workout_records    | 운동 기록               | 유저 입력     |
-- | workout_sets       | 세트 정보               | 유저 입력     |
-- | daily_memos        | 날짜별 메모 (메모 뷰용) | 유저 입력     |

-- ============================================
-- 변경 이력
-- ============================================
-- | 버전 | 날짜       | 변경 내용                              |
-- |------|------------|----------------------------------------|
-- | 1.0  | 2025-01-XX | 초기 설계 - 시스템 정의 운동 종목       |
-- | 2.0  | 2025-01-14 | 유저 입력 기반으로 변경                 |
-- |      |            | - exercise_types → user_exercises       |
-- |      |            | - 카테고리 10개로 변경                  |
-- |      |            | - 세트 필드 정리 (weight/reps/distance/duration) |
-- |      |            | - language 기본값 'ja'로 변경           |
-- | 2.1  | 2025-01-15 | daily_memos 테이블 추가                 |
-- |      |            | - 캘린더 상세 메모 뷰 기능 지원         |
-- |      |            | - workout_sessions.notes 필드 제거      |
-- |      |            | - 모든 메모는 daily_memos로 통합        |
