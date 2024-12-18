# permah-react + backend express + orm

## starting server
```bash
### start frontend
cd permah-react
npm install
npm start

### then start the backend by 
cd backend
npm install
npm start

## make migration
npm run typeorm migration:generate src/migrations/CreateTables -- -d src/config/datasource.ts

