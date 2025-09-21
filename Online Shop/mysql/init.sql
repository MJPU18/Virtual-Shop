CREATE DATABASE IF NOT EXISTS users;
CREATE DATABASE IF NOT EXISTS salesdetails;
CREATE DATABASE IF NOT EXISTS sales;
CREATE DATABASE IF NOT EXISTS providers;
CREATE DATABASE IF NOT EXISTS products;
CREATE DATABASE IF NOT EXISTS clients;

-- Opcional: Crear usuario específico para la aplicación (recomendado para producción)
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'apppassword';
GRANT ALL PRIVILEGES ON users.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON salesdetails.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON sales.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON providers.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON products.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON clients.* TO 'appuser'@'%';
FLUSH PRIVILEGES;