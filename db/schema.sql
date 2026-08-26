CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  name varchar(120) NOT NULL,
  description varchar(800) NOT NULL,
  icon varchar(40) NOT NULL,
  image_url text NOT NULL,
  image_alt varchar(240) NOT NULL,
  image_position varchar(48) NOT NULL DEFAULT '50% 50%',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinic_gallery (
  id text PRIMARY KEY,
  image_url text NOT NULL,
  alt varchar(240) NOT NULL,
  label varchar(120) NOT NULL,
  image_position varchar(48) NOT NULL DEFAULT '50% 50%',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_stories (
  id text PRIMARY KEY,
  name varchar(120) NOT NULL,
  treatment varchar(160) NOT NULL,
  quote varchar(800) NOT NULL,
  video_url text NOT NULL,
  duration varchar(16) NOT NULL DEFAULT '',
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinic_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  clinic_name varchar(160) NOT NULL,
  phone varchar(80) NOT NULL DEFAULT '',
  whatsapp varchar(80) NOT NULL DEFAULT '',
  address varchar(400) NOT NULL DEFAULT '',
  working_hours varchar(240) NOT NULL DEFAULT '',
  email varchar(200) NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  telegram text NOT NULL DEFAULT '',
  google_maps_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id text PRIMARY KEY,
  name varchar(120) NOT NULL,
  phone varchar(80) NOT NULL,
  email varchar(200) NOT NULL DEFAULT '',
  service varchar(160) NOT NULL DEFAULT '',
  preferred_date date,
  preferred_time time,
  message varchar(1500) NOT NULL DEFAULT '',
  status varchar(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_credentials (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  password_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS services_public_order_idx
  ON services (active, sort_order, created_at);

CREATE INDEX IF NOT EXISTS clinic_gallery_public_order_idx
  ON clinic_gallery (active, sort_order, created_at);

CREATE INDEX IF NOT EXISTS patient_stories_public_order_idx
  ON patient_stories (active, sort_order, created_at);

CREATE INDEX IF NOT EXISTS appointments_status_created_idx
  ON appointments (status, created_at DESC);
