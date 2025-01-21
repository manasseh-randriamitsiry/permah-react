#!/bin/bash

# Drop and recreate test database
mysql -u root -proot << EOF
DROP DATABASE IF EXISTS event_manager_test;
CREATE DATABASE event_manager_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# Set proper character set and collation
mysql -u root -proot -e "ALTER DATABASE event_manager_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 