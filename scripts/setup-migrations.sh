#!/bin/bash

# 기존 migration들을 "이미 적용됨"으로 표시
echo "🔧 기존 migration들을 적용된 것으로 표시 중..."

npx prisma migrate resolve --applied 20250810233550_forum_basics
npx prisma migrate resolve --applied 20250816121811_add_admin_model
npx prisma migrate resolve --applied 20250816210742_add_discussion_fields
npx prisma migrate resolve --applied 20250816214229_add_user_system
npx prisma migrate resolve --applied 20250817180514_add_nickname_password
npx prisma migrate resolve --applied 20250817184157_fix_anonymous_likes
npx prisma migrate resolve --applied 20250817210242_remove_unique_constraint
npx prisma migrate resolve --applied 20250817211854_remove_user_relations
npx prisma migrate resolve --applied 20250817215213_add_comment_upvotes_downvotes
npx prisma migrate resolve --applied 20250915231719_add_contract_guide
npx prisma migrate resolve --applied 20250915231956_add_system_settings_and_announcements
npx prisma migrate resolve --applied 20250915232438_add_user_profile_and_notifications
npx prisma migrate resolve --applied 20250915233845_add_file_upload

echo "✅ 기존 migration 설정 완료!"

# 새로운 migration 적용
echo "🚀 새로운 migration 적용 중..."
npx prisma migrate deploy

echo "✅ Migration 설정 완료!"

