# schemas.py

from pydantic import BaseModel

class ToDoItemBase(BaseModel):
    text: str
    status: str
    completed: bool = False

class ToDoItemCreate(ToDoItemBase):
    pass

class ToDoItem(ToDoItemBase):
    id: int

    class Config:
        orm_mode = True
