# Usa imagem base Node
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe porta padrão
EXPOSE 3000

# Comando de start
CMD ["npm", "start"]
