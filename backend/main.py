# main.py

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from .database import get_db, create_tables
from . import models, schemas, crud
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins. Adjust this as needed for security.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Call create_tables function to ensure table creation
create_tables()

@app.post("/todos/", response_model=schemas.ToDoItem)
def create_todo(todo: schemas.ToDoItemCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, todo)

@app.get("/todos/", response_model=List[schemas.ToDoItem])
def get_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)

@app.get("/todos/{todo_id}", response_model=schemas.ToDoItem)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.get_todo_by_id(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return todo

@app.put("/todos/{todo_id}", response_model=schemas.ToDoItem)
def update_todo(todo_id: int, todo_data: schemas.ToDoItemBase, db: Session = Depends(get_db)):
    updated_todo = crud.update_todo(db, todo_id, todo_data)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return updated_todo

@app.delete("/todos/{todo_id}", response_model=dict)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    deleted_todo = crud.delete_todo(db, todo_id)
    if not deleted_todo:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return {"message": "Todo item deleted successfully"}
