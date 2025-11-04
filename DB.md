-- ============================================
-- 운동기록 웹사이트 - Supabase 초기 설정 (부위별 버전)
-- ============================================

-- 1. Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  language_preference VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ExerciseType 테이블 (운동 종류 마스터)
CREATE TABLE exercise_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  body_part VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'weight', 'reps', 'time_speed'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ExerciseTypes 다국어 번역 테이블
CREATE TABLE exercise_types_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_type_id UUID NOT NULL REFERENCES exercise_types(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL, -- 'en', 'ko', 'zh', 'ja'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exercise_type_id, language)
);

-- 4. BodyPart 다국어 테이블
CREATE TABLE body_part_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body_part VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  UNIQUE(body_part, language)
);

-- 5. WorkoutDay 테이블 (그 날 운동)
CREATE TABLE workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  note TEXT,
  total_duration_min INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- 6. ExerciseRecord 테이블 (그날 한 운동)
CREATE TABLE exercise_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_day_id UUID NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
  exercise_type_id UUID NOT NULL REFERENCES exercise_types(id),
  set_count INTEGER,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. SetRecord 테이블 (세트별 기록)
CREATE TABLE set_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_record_id UUID NOT NULL REFERENCES exercise_records(id) ON DELETE CASCADE,
  set_order INTEGER NOT NULL,
  weight FLOAT,
  reps INTEGER,
  time_min FLOAT,
  speed FLOAT,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 인덱스 (성능 최적화)
-- ============================================
CREATE INDEX idx_workout_days_user_id ON workout_days(user_id);
CREATE INDEX idx_workout_days_date ON workout_days(date);
CREATE INDEX idx_exercise_records_workout_day_id ON exercise_records(workout_day_id);
CREATE INDEX idx_set_records_exercise_record_id ON set_records(exercise_record_id);

-- ============================================
-- 초기 데이터 - 부위 다국어
-- ============================================
INSERT INTO body_part_i18n (body_part, language, name) VALUES
-- Back (등)
('back', 'en', 'Back'),
('back', 'ko', '등'),
('back', 'zh', '背'),
('back', 'ja', '背中'),

-- Shoulder (어깨)
('shoulder', 'en', 'Shoulder'),
('shoulder', 'ko', '어깨'),
('shoulder', 'zh', '肩膀'),
('shoulder', 'ja', '肩'),

-- Chest (가슴)
('chest', 'en', 'Chest'),
('chest', 'ko', '가슴'),
('chest', 'zh', '胸部'),
('chest', 'ja', '胸'),

-- Biceps (이두)
('biceps', 'en', 'Biceps'),
('biceps', 'ko', '이두'),
('biceps', 'zh', '二头肌'),
('biceps', 'ja', '上腕二頭筋'),

-- Triceps (삼두)
('triceps', 'en', 'Triceps'),
('triceps', 'ko', '삼두'),
('triceps', 'zh', '三头肌'),
('triceps', 'ja', '上腕三頭筋'),

-- Legs (다리)
('legs', 'en', 'Legs'),
('legs', 'ko', '다리'),
('legs', 'zh', '腿'),
('legs', 'ja', '脚'),

-- Core (복근)
('core', 'en', 'Core/Abs'),
('core', 'ko', '복근'),
('core', 'zh', '核心'),
('core', 'ja', 'コア'),

-- Cardio (유산소)
('cardio', 'en', 'Cardio'),
('cardio', 'ko', '유산소'),
('cardio', 'zh', '有氧运动'),
('cardio', 'ja', '有酸素運動');

-- ============================================
-- 초기 데이터 - 운동 종목 (원본 - 영어)
-- ============================================
INSERT INTO exercise_types (name, body_part, type, description) VALUES
-- Back (등)
('Pull Up', 'back', 'reps', 'Back exercise'),
('Lat Pulldown', 'back', 'weight', 'Back exercise'),
('Barbell Row', 'back', 'weight', 'Back exercise'),
('Dumbbell Row', 'back', 'weight', 'Back exercise'),
('Seated Row', 'back', 'weight', 'Back exercise'),

-- Shoulder (어깨)
('Shoulder Press', 'shoulder', 'weight', 'Shoulder exercise'),
('Military Press', 'shoulder', 'weight', 'Shoulder exercise'),
('Lateral Raise', 'shoulder', 'weight', 'Shoulder exercise'),
('Overhead Press', 'shoulder', 'weight', 'Shoulder exercise'),

-- Chest (가슴)
('Bench Press', 'chest', 'weight', 'Chest exercise'),
('Dumbbell Press', 'chest', 'weight', 'Chest exercise'),
('Incline Bench Press', 'chest', 'weight', 'Chest exercise'),
('Cable Fly', 'chest', 'weight', 'Chest exercise'),
('Push Up', 'chest', 'reps', 'Chest exercise'),

-- Biceps (이두)
('Barbell Curl', 'biceps', 'weight', 'Biceps exercise'),
('Dumbbell Curl', 'biceps', 'weight', 'Biceps exercise'),
('Hammer Curl', 'biceps', 'weight', 'Biceps exercise'),
('Cable Curl', 'biceps', 'weight', 'Biceps exercise'),

-- Triceps (삼두)
('Triceps Dips', 'triceps', 'reps', 'Triceps exercise'),
('Triceps Pushdown', 'triceps', 'weight', 'Triceps exercise'),
('Overhead Extension', 'triceps', 'weight', 'Triceps exercise'),
('Close Grip Bench Press', 'triceps', 'weight', 'Triceps exercise'),

-- Legs (다리)
('Squat', 'legs', 'weight', 'Leg exercise'),
('Leg Press', 'legs', 'weight', 'Leg exercise'),
('Deadlift', 'legs', 'weight', 'Full body exercise'),
('Leg Curl', 'legs', 'weight', 'Leg exercise'),
('Leg Extension', 'legs', 'weight', 'Leg exercise'),
('Lunges', 'legs', 'weight', 'Leg exercise'),

-- Core (복근)
('Crunch', 'core', 'reps', 'Core exercise'),
('Hanging Leg Raise', 'core', 'reps', 'Core exercise'),
('Plank', 'core', 'time_speed', 'Core exercise'),
('Ab Wheel', 'core', 'reps', 'Core exercise'),

-- Cardio (유산소)
('Running', 'cardio', 'time_speed', 'Cardio exercise'),
('Cycling', 'cardio', 'time_speed', 'Cardio exercise'),
('Treadmill', 'cardio', 'time_speed', 'Cardio exercise'),
('Rowing Machine', 'cardio', 'time_speed', 'Cardio exercise'),
('Elliptical', 'cardio', 'time_speed', 'Cardio exercise');

-- ============================================
-- 운동 다국어 번역 (한국어)
-- ============================================
INSERT INTO exercise_types_i18n (exercise_type_id, language, name, description) VALUES
-- Back (등)
((SELECT id FROM exercise_types WHERE name = 'Pull Up'), 'ko', '풀업', '등 운동'),
((SELECT id FROM exercise_types WHERE name = 'Lat Pulldown'), 'ko', '랫풀다운', '등 운동'),
((SELECT id FROM exercise_types WHERE name = 'Barbell Row'), 'ko', '바벨로우', '등 운동'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Row'), 'ko', '덤벨로우', '등 운동'),
((SELECT id FROM exercise_types WHERE name = 'Seated Row'), 'ko', '시티드로우', '등 운동'),

-- Shoulder (어깨)
((SELECT id FROM exercise_types WHERE name = 'Shoulder Press'), 'ko', '숄더프레스', '어깨 운동'),
((SELECT id FROM exercise_types WHERE name = 'Military Press'), 'ko', '밀리터리프레스', '어깨 운동'),
((SELECT id FROM exercise_types WHERE name = 'Lateral Raise'), 'ko', '사이드레이즈', '어깨 운동'),
((SELECT id FROM exercise_types WHERE name = 'Overhead Press'), 'ko', '오버헤드프레스', '어깨 운동'),

-- Chest (가슴)
((SELECT id FROM exercise_types WHERE name = 'Bench Press'), 'ko', '벤치프레스', '가슴 운동'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Press'), 'ko', '덤벨프레스', '가슴 운동'),
((SELECT id FROM exercise_types WHERE name = 'Incline Bench Press'), 'ko', '인클라인벤치프레스', '가슴 운동'),
((SELECT id FROM exercise_types WHERE name = 'Cable Fly'), 'ko', '케이블플라이', '가슴 운동'),
((SELECT id FROM exercise_types WHERE name = 'Push Up'), 'ko', '푸시업', '가슴 운동'),

-- Biceps (이두)
((SELECT id FROM exercise_types WHERE name = 'Barbell Curl'), 'ko', '바벨컬', '이두 운동'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Curl'), 'ko', '덤벨컬', '이두 운동'),
((SELECT id FROM exercise_types WHERE name = 'Hammer Curl'), 'ko', '해머컬', '이두 운동'),
((SELECT id FROM exercise_types WHERE name = 'Cable Curl'), 'ko', '케이블컬', '이두 운동'),

-- Triceps (삼두)
((SELECT id FROM exercise_types WHERE name = 'Triceps Dips'), 'ko', '삼두 딥스', '삼두 운동'),
((SELECT id FROM exercise_types WHERE name = 'Triceps Pushdown'), 'ko', '트라이셉스 푸시다운', '삼두 운동'),
((SELECT id FROM exercise_types WHERE name = 'Overhead Extension'), 'ko', '오버헤드 익스텐션', '삼두 운동'),
((SELECT id FROM exercise_types WHERE name = 'Close Grip Bench Press'), 'ko', '클로즈그립벤치프레스', '삼두 운동'),

-- Legs (다리)
((SELECT id FROM exercise_types WHERE name = 'Squat'), 'ko', '스쿼트', '다리 운동'),
((SELECT id FROM exercise_types WHERE name = 'Leg Press'), 'ko', '레그프레스', '다리 운동'),
((SELECT id FROM exercise_types WHERE name = 'Deadlift'), 'ko', '데드리프트', '전신 운동'),
((SELECT id FROM exercise_types WHERE name = 'Leg Curl'), 'ko', '레그컬', '다리 운동'),
((SELECT id FROM exercise_types WHERE name = 'Leg Extension'), 'ko', '레그익스텐션', '다리 운동'),
((SELECT id FROM exercise_types WHERE name = 'Lunges'), 'ko', '런지', '다리 운동'),

-- Core (복근)
((SELECT id FROM exercise_types WHERE name = 'Crunch'), 'ko', '크런치', '복근 운동'),
((SELECT id FROM exercise_types WHERE name = 'Hanging Leg Raise'), 'ko', '행드레그레이즈', '복근 운동'),
((SELECT id FROM exercise_types WHERE name = 'Plank'), 'ko', '플랭크', '복근 운동'),
((SELECT id FROM exercise_types WHERE name = 'Ab Wheel'), 'ko', '복근 휠', '복근 운동'),

-- Cardio (유산소)
((SELECT id FROM exercise_types WHERE name = 'Running'), 'ko', '런닝', '유산소 운동'),
((SELECT id FROM exercise_types WHERE name = 'Cycling'), 'ko', '자전거', '유산소 운동'),
((SELECT id FROM exercise_types WHERE name = 'Treadmill'), 'ko', '트레드밀', '유산소 운동'),
((SELECT id FROM exercise_types WHERE name = 'Rowing Machine'), 'ko', '로잉머신', '유산소 운동'),
((SELECT id FROM exercise_types WHERE name = 'Elliptical'), 'ko', '엘립티컬', '유산소 운동');

-- ============================================
-- 운동 다국어 번역 (중국어)
-- ============================================
INSERT INTO exercise_types_i18n (exercise_type_id, language, name, description) VALUES
-- Back (등)
((SELECT id FROM exercise_types WHERE name = 'Pull Up'), 'zh', '引体向上', '背部运动'),
((SELECT id FROM exercise_types WHERE name = 'Lat Pulldown'), 'zh', '宽握下拉', '背部运动'),
((SELECT id FROM exercise_types WHERE name = 'Barbell Row'), 'zh', '杠铃划船', '背部运动'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Row'), 'zh', '哑铃划船', '背部运动'),
((SELECT id FROM exercise_types WHERE name = 'Seated Row'), 'zh', '坐姿划船', '背部运动'),

-- Shoulder (어깨)
((SELECT id FROM exercise_types WHERE name = 'Shoulder Press'), 'zh', '肩推', '肩膀运动'),
((SELECT id FROM exercise_types WHERE name = 'Military Press'), 'zh', '军事推举', '肩膀运动'),
((SELECT id FROM exercise_types WHERE name = 'Lateral Raise'), 'zh', '侧平举', '肩膀运动'),
((SELECT id FROM exercise_types WHERE name = 'Overhead Press'), 'zh', '头上推举', '肩膀运动'),

-- Chest (가슴)
((SELECT id FROM exercise_types WHERE name = 'Bench Press'), 'zh', '卧推', '胸部运动'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Press'), 'zh', '哑铃卧推', '胸部运动'),
((SELECT id FROM exercise_types WHERE name = 'Incline Bench Press'), 'zh', '上斜卧推', '胸部运动'),
((SELECT id FROM exercise_types WHERE name = 'Cable Fly'), 'zh', '绳索夹胸', '胸部运动'),
((SELECT id FROM exercise_types WHERE name = 'Push Up'), 'zh', '俯卧撑', '胸部运动'),

-- Biceps (이두)
((SELECT id FROM exercise_types WHERE name = 'Barbell Curl'), 'zh', '杠铃弯举', '二头肌运动'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Curl'), 'zh', '哑铃弯举', '二头肌运动'),
((SELECT id FROM exercise_types WHERE name = 'Hammer Curl'), 'zh', '锤式弯举', '二头肌运动'),
((SELECT id FROM exercise_types WHERE name = 'Cable Curl'), 'zh', '绳索弯举', '二头肌运动'),

-- Triceps (삼두)
((SELECT id FROM exercise_types WHERE name = 'Triceps Dips'), 'zh', '三头肌下压', '三头肌运动'),
((SELECT id FROM exercise_types WHERE name = 'Triceps Pushdown'), 'zh', '绳索下压', '三头肌运动'),
((SELECT id FROM exercise_types WHERE name = 'Overhead Extension'), 'zh', '头顶伸展', '三头肌运动'),
((SELECT id FROM exercise_types WHERE name = 'Close Grip Bench Press'), 'zh', '窄握卧推', '三头肌运动'),

-- Legs (다리)
((SELECT id FROM exercise_types WHERE name = 'Squat'), 'zh', '深蹲', '腿部运动'),
((SELECT id FROM exercise_types WHERE name = 'Leg Press'), 'zh', '腿部推蹬机', '腿部运动'),
((SELECT id FROM exercise_types WHERE name = 'Deadlift'), 'zh', '硬拉', '全身运动'),
((SELECT id FROM exercise_types WHERE name = 'Leg Curl'), 'zh', '腿部弯举', '腿部运动'),
((SELECT id FROM exercise_types WHERE name = 'Leg Extension'), 'zh', '腿部伸展', '腿部运动'),
((SELECT id FROM exercise_types WHERE name = 'Lunges'), 'zh', '弓步', '腿部运动'),

-- Core (복근)
((SELECT id FROM exercise_types WHERE name = 'Crunch'), 'zh', '仰卧起坐', '核心运动'),
((SELECT id FROM exercise_types WHERE name = 'Hanging Leg Raise'), 'zh', '悬杆抬腿', '核心运动'),
((SELECT id FROM exercise_types WHERE name = 'Plank'), 'zh', '平板支撑', '核心运动'),
((SELECT id FROM exercise_types WHERE name = 'Ab Wheel'), 'zh', '腹肌滑轮', '核心运动'),

-- Cardio (유산소)
((SELECT id FROM exercise_types WHERE name = 'Running'), 'zh', '跑步', '有氧运动'),
((SELECT id FROM exercise_types WHERE name = 'Cycling'), 'zh', '骑自行车', '有氧运动'),
((SELECT id FROM exercise_types WHERE name = 'Treadmill'), 'zh', '跑步机', '有氧运动'),
((SELECT id FROM exercise_types WHERE name = 'Rowing Machine'), 'zh', '划船机', '有氧运动'),
((SELECT id FROM exercise_types WHERE name = 'Elliptical'), 'zh', '椭圆机', '有氧运动');

-- ============================================
-- 운동 다국어 번역 (일본어)
-- ============================================
INSERT INTO exercise_types_i18n (exercise_type_id, language, name, description) VALUES
-- Back (등)
((SELECT id FROM exercise_types WHERE name = 'Pull Up'), 'ja', 'プルアップ', '背中の運動'),
((SELECT id FROM exercise_types WHERE name = 'Lat Pulldown'), 'ja', 'ラットプルダウン', '背中の運動'),
((SELECT id FROM exercise_types WHERE name = 'Barbell Row'), 'ja', 'バーベルロウ', '背中の運動'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Row'), 'ja', 'ダンベルロウ', '背中の運動'),
((SELECT id FROM exercise_types WHERE name = 'Seated Row'), 'ja', 'シーテッドロウ', '背中の運動'),

-- Shoulder (어깨)
((SELECT id FROM exercise_types WHERE name = 'Shoulder Press'), 'ja', 'ショルダープレス', '肩の運動'),
((SELECT id FROM exercise_types WHERE name = 'Military Press'), 'ja', 'ミリタリープレス', '肩の運動'),
((SELECT id FROM exercise_types WHERE name = 'Lateral Raise'), 'ja', 'サイドレイズ', '肩の運動'),
((SELECT id FROM exercise_types WHERE name = 'Overhead Press'), 'ja', 'オーバーヘッドプレス', '肩の運動'),

-- Chest (가슴)
((SELECT id FROM exercise_types WHERE name = 'Bench Press'), 'ja', 'ベンチプレス', '胸の運動'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Press'), 'ja', 'ダンベルプレス', '胸の運動'),
((SELECT id FROM exercise_types WHERE name = 'Incline Bench Press'), 'ja', 'インクラインベンチプレス', '胸の運動'),
((SELECT id FROM exercise_types WHERE name = 'Cable Fly'), 'ja', 'ケーブルフライ', '胸の運動'),
((SELECT id FROM exercise_types WHERE name = 'Push Up'), 'ja', 'プッシュアップ', '胸の運動'),

-- Biceps (이두)
((SELECT id FROM exercise_types WHERE name = 'Barbell Curl'), 'ja', 'バーベルカール', '上腕二頭筋の運動'),
((SELECT id FROM exercise_types WHERE name = 'Dumbbell Curl'), 'ja', 'ダンベルカール', '上腕二頭筋の運動'),
((SELECT id FROM exercise_types WHERE name = 'Hammer Curl'), 'ja', 'ハンマーカール', '上腕二頭筋の運動'),
((SELECT id FROM exercise_types WHERE name = 'Cable Curl'), 'ja', 'ケーブルカール', '上腕二頭筋の運動'),

-- Triceps (삼두)
((SELECT id FROM exercise_types WHERE name = 'Triceps Dips'), 'ja', 'トライセプスディップス', '上腕三頭筋の運動'),
((SELECT id FROM exercise_types WHERE name = 'Triceps Pushdown'), 'ja', 'トライセプスプッシュダウン', '上腕三頭筋の運動'),
((SELECT id FROM exercise_types WHERE name = 'Overhead Extension'), 'ja', 'オーバーヘッドエクステンション', '上腕三頭筋の運動'),
((SELECT id FROM exercise_types WHERE name = 'Close Grip Bench Press'), 'ja', 'クローズグリップベンチプレス', '上腕三頭筋の運動'),

-- Legs (다리)
((SELECT id FROM exercise_types WHERE name = 'Squat'), 'ja', 'スクワット', '脚の運動'),
((SELECT id FROM exercise_types WHERE name = 'Leg Press'), 'ja', 'レッグプレス', '脚の運動'),
((SELECT id FROM exercise_types WHERE name = 'Deadlift'), 'ja', 'デッドリフト', '全身運動'),
((SELECT id FROM exercise_types WHERE name = 'Leg Curl'), 'ja', 'レッグカール', '脚の運動'),
((SELECT id FROM exercise_types WHERE name = 'Leg Extension'), 'ja', 'レッグエクステンション', '脚の運動'),
((SELECT id FROM exercise_types WHERE name = 'Lunges'), 'ja', 'ランジ', '脚の運動'),

-- Core (복근)
((SELECT id FROM exercise_types WHERE name = 'Crunch'), 'ja', 'クランチ', 'コアの運動'),
((SELECT id FROM exercise_types WHERE name = 'Hanging Leg Raise'), 'ja', 'ハンギングレッグレイズ', 'コアの運動'),
((SELECT id FROM exercise_types WHERE name = 'Plank'), 'ja', 'プランク', 'コアの運動'),
((SELECT id FROM exercise_types WHERE name = 'Ab Wheel'), 'ja', '腹筋ローラー', 'コアの運動'),

-- Cardio (유산소)
((SELECT id FROM exercise_types WHERE name = 'Running'), 'ja', 'ランニング', '有酸素運動'),
((SELECT id FROM exercise_types WHERE name = 'Cycling'), 'ja', 'サイクリング', '有酸素運動'),
((SELECT id FROM exercise_types WHERE name = 'Treadmill'), 'ja', 'トレッドミル', '有酸素運動'),
((SELECT id FROM exercise_types WHERE name = 'Rowing Machine'), 'ja', 'ローイングマシン', '有酸素運動'),
((SELECT id FROM exercise_types WHERE name = 'Elliptical'), 'ja', 'エリプティカル', '有酸素運動');

-- ============================================
-- Row Level Security (RLS) 설정
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_records ENABLE ROW LEVEL SECURITY;

-- Users 테이블 정책
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- WorkoutDays 테이블 정책
CREATE POLICY "Users can view own workouts"
  ON workout_days FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workouts"
  ON workout_days FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workouts"
  ON workout_days FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workouts"
  ON workout_days FOR DELETE
  USING (user_id = auth.uid());

-- ExerciseRecords 테이블 정책
CREATE POLICY "Users can view own exercise records"
  ON exercise_records FOR SELECT
  USING (
    workout_day_id IN (
      SELECT id FROM workout_days WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own exercise records"
  ON exercise_records FOR INSERT
  WITH CHECK (
    workout_day_id IN (
      SELECT id FROM workout_days WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own exercise records"
  ON exercise_records FOR UPDATE
  USING (
    workout_day_id IN (
      SELECT id FROM workout_days WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own exercise records"
  ON exercise_records FOR DELETE
  USING (
    workout_day_id IN (
      SELECT id FROM workout_days WHERE user_id = auth.uid()
    )
  );

-- SetRecords 테이블 정책
CREATE POLICY "Users can view own set records"
  ON set_records FOR SELECT
  USING (
    exercise_record_id IN (
      SELECT id FROM exercise_records 
      WHERE workout_day_id IN (
        SELECT id FROM workout_days WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own set records"
  ON set_records FOR INSERT
  WITH CHECK (
    exercise_record_id IN (
      SELECT id FROM exercise_records 
      WHERE workout_day_id IN (
        SELECT id FROM workout_days WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update own set records"
  ON set_records FOR UPDATE
  USING (
    exercise_record_id IN (
      SELECT id FROM exercise_records 
      WHERE workout_day_id IN (
        SELECT id FROM workout_days WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete own set records"
  ON set_records FOR DELETE
  USING (
    exercise_record_id IN (
      SELECT id FROM exercise_records 
      WHERE workout_day_id IN (
        SELECT id FROM workout_days WHERE user_id = auth.uid()
      )
    )
  );

-- ExerciseTypes와 번역 테이블은 공개 (모두 읽기만 가능)
ALTER TABLE exercise_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_types_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_part_i18n ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercise types are public"
  ON exercise_types FOR SELECT
  USING (true);

CREATE POLICY "Exercise types translations are public"
  ON exercise_types_i18n FOR SELECT
  USING (true);

CREATE POLICY "Body part translations are public"
  ON body_part_i18n FOR SELECT
  USING (true);