from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# Postgres connection parameters
DATABASE_URL = "postgresql://test:test@localhost/quakedata"

# Create the database engine
engine = create_engine(DATABASE_URL)

# Create a Session class to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency for injecting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
