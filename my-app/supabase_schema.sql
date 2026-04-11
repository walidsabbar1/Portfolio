-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Function to handle updated_at timestamps (Fixed search_path issue)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Projects Table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  technologies text[],
  project_url text,
  code_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for Projects
create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();

-- Skills Table
create table if not exists skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  level integer check (level >= 0 and level <= 10),
  icon_name text,
  color text,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for Skills
create trigger update_skills_updated_at
  before update on skills
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security
alter table projects enable row level security;
alter table skills enable row level security;

-- Create policies (Public Read, Authenticated Write)
-- Projects policies
create policy "Public projects are viewable by everyone"
  on projects for select
  using ( true );

create policy "Users can insert their own projects"
  on projects for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own projects"
  on projects for update
  using ( auth.role() = 'authenticated' );

create policy "Users can delete their own projects"
  on projects for delete
  using ( auth.role() = 'authenticated' );

-- Skills policies
create policy "Public skills are viewable by everyone"
  on skills for select
  using ( true );

create policy "Users can insert their own skills"
  on skills for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own skills"
  on skills for update
  using ( auth.role() = 'authenticated' );

create policy "Users can delete their own skills"
  on skills for delete
  using ( auth.role() = 'authenticated' );

/*
insert into skills (name, category, level, icon_name, color, display_order) values
('React', 'Frontend', 9, 'FaReact', '#61DAFB', 1),
('Node.js', 'Backend', 8, 'FaNodeJs', '#339933', 2),
('SQL', 'Database', 7, 'SiMysql', '#4479A1', 3),
('Office', 'Tools', 8, 'FaFileExcel', '#217346', 4),  
('CSS', 'Foundation', 8, 'FaCss3Alt', '#1572B6', 5),
('MongoDB', 'Database', 8, 'SiMongodb', '#47A248', 6),
('Agile', 'Tools', 8, 'FaTasks', '#6366f1', 7),
('JavaScript', 'Foundation', 8, 'FaJs', '#F7DF1E', 8),
('Laravel', 'Backend', 8, 'SiLaravel', '#FF2D20', 9),
('GitHub', 'Tools', 8, 'FaGithub', '#181717', 10),
('Git', 'Tools', 8, 'FaGitAlt', '#F05032', 11),
('HTML', 'Foundation', 8, 'FaHtml5', '#E34F26', 12),
('PHP', 'Backend', 8, 'SiPhp', '#777BB4', 13);
*/

/*
insert into projects (title, description, technologies, project_url, code_url) values
('Masterclass OOP JavaScript', 'Programmation Orientée Objet - Exercices Pratiques et Progressifs', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://masterclass-oop-java-script.vercel.app/', 'https://github.com/walidsabbar1/Masterclass-OOP-JavaScript'),
('Product Photographer Portfolio', 'APortfolio professionnel pour photographe de produits – mise en valeur visuelle, design minimaliste et navigation fluide', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://miraspic.vercel.app/', 'https://example.com'),
('Study platform', 'Real-time messaging and collaboration, all in one clean and intuitive app', ARRAY['React','Laravel','MySQL'], 'https://example.com', 'https://github.com/abdelazizhaimoud/StudyPlatform');
*/
