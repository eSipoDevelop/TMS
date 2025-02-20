from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# ✅ Configurar SQLite
DATABASE_URL = "sqlite:///./transportes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ Modelo de la base de datos
class TransporteDB(Base):
    __tablename__ = "transportes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    capacidad = Column(Integer)
    tipo = Column(String)

# ✅ Crear la tabla en la base de datos
Base.metadata.create_all(bind=engine)

# ✅ Modelo de datos con validaciones
class Transporte(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    capacidad: int = Field(..., gt=0, description="Debe ser un número positivo")
    tipo: str = Field(..., min_length=3, max_length=50)

# ✅ Crear la aplicación FastAPI
app = FastAPI()

# ✅ Habilitar CORS para conectar con React
# ✅ Habilitar CORS con configuración correcta
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cambia "*" por mayor seguridad
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los headers
    expose_headers=["Content-Type", "Authorization"],  # ✅ Permitir que el frontend acceda a estos headers
)



# ✅ Dependencia para obtener la sesión de la BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Ruta de prueba
@app.get("/")
def read_root():
    return {"message": "API funcionando correctamente"}

# ✅ Obtener transportes desde la BD
@app.get("/transporte", response_model=List[dict])
def get_transportes(db: SessionLocal = Depends(get_db)):
    transportes = db.query(TransporteDB).all()
    return [{"id": t.id, "nombre": t.nombre, "capacidad": t.capacidad, "tipo": t.tipo} for t in transportes]  # ✅ Convertimos a diccionario


# ✅ Agregar un transporte a la BD
@app.post("/transporte")
def add_transporte(transporte: Transporte, db: SessionLocal = Depends(get_db)):
    nuevo_transporte = TransporteDB(**transporte.dict())
    db.add(nuevo_transporte)
    db.commit()
    db.refresh(nuevo_transporte)
    return {
        "message": "Transporte agregado",
        "data": {"id": nuevo_transporte.id, "nombre": nuevo_transporte.nombre, "capacidad": nuevo_transporte.capacidad, "tipo": nuevo_transporte.tipo}
    }


# ✅ Actualizar un transporte existente
@app.put("/transporte/{id}")
def update_transporte(id: int, transporte: Transporte, db: SessionLocal = Depends(get_db)):
    transporte_existente = db.query(TransporteDB).filter(TransporteDB.id == id).first()
    if not transporte_existente:
        raise HTTPException(status_code=404, detail="Transporte no encontrado")

    for key, value in transporte.dict().items():
        setattr(transporte_existente, key, value)

    db.commit()
    db.refresh(transporte_existente)
    return {
        "message": "Transporte actualizado",
        "data": {"id": transporte_existente.id, "nombre": transporte_existente.nombre, "capacidad": transporte_existente.capacidad, "tipo": transporte_existente.tipo}
    }


# ✅ Eliminar un transporte por ID
@app.delete("/transporte/{id}")
def delete_transporte(id: int, db: SessionLocal = Depends(get_db)):
    transporte_existente = db.query(TransporteDB).filter(TransporteDB.id == id).first()
    if not transporte_existente:
        raise HTTPException(status_code=404, detail="Transporte no encontrado")

    db.delete(transporte_existente)
    db.commit()
    return {"message": "Transporte eliminado"}

