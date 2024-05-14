# models.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ToDoItem(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    status = Column(String, index=True)  # Can be "To Do", "In Progress", or "Done"
    completed = Column(Boolean, default=False)
