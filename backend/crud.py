# crud.py

from sqlalchemy.orm import Session
from . import models, schemas

def create_todo(db: Session, todo: schemas.ToDoItemCreate):
    db_todo = models.ToDoItem(text=todo.text, status=todo.status, completed=todo.completed)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def get_todos(db: Session):
    return db.query(models.ToDoItem).all()

def get_todo_by_id(db: Session, todo_id: int):
    return db.query(models.ToDoItem).filter(models.ToDoItem.id == todo_id).first()

def update_todo(db: Session, todo_id: int, todo_data: schemas.ToDoItemBase):
    todo = db.query(models.ToDoItem).filter(models.ToDoItem.id == todo_id).first()
    if not todo:
        return None
    for key, value in todo_data.dict(exclude_unset=True).items():
        setattr(todo, key, value)
    db.commit()
    db.refresh(todo)
    return todo

def delete_todo(db: Session, todo_id: int):
    todo = db.query(models.ToDoItem).filter(models.ToDoItem.id == todo_id).first()
    if not todo:
        return None
    db.delete(todo)
    db.commit()
    return todo
