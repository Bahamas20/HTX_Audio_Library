CREATE TABLE IF NOT EXISTS public.users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_username_key UNIQUE (username)
);

INSERT INTO public.users (username, email, password_hash) 
VALUES ('admin', 'admin@example.com', '$2b$10$8KPk4UAY/8MF53u4MXKfb.lZUCnQ6cFwmZLaVu0.Qd3qeE7rdJvky')
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.audios (
  audio_id SERIAL PRIMARY KEY,
  user_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category TEXT,
  s3_url TEXT,
  CONSTRAINT audios_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);
