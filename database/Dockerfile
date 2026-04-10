FROM mysql:8.0
COPY schema.sql /docker-entrypoint-initdb.d/
ENV MYSQL_DATABASE=sims_db
ENV MYSQL_ROOT_PASSWORD=123456
