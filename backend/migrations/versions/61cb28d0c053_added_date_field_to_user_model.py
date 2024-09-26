"""Added date field to User model

Revision ID: 61cb28d0c053
Revises: 
Create Date: 2024-08-24 11:44:41.369713

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '61cb28d0c053'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('client', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', sa.DateTime(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('client', schema=None) as batch_op:
        batch_op.drop_column('date')

    # ### end Alembic commands ###