import Page from "@/components/layouts/page/Page";
import {
  useFindUsersWithConversationsBadgeQuery,
  useGetUsersQuery,
} from "@/utils/api";
import { Sidebar } from "@/components/sidebar/Sidebar";
import styles from "../../components/UsersSidebar/UsersSidebar.module.css";
import Link from "next/link";

const UsersPage = () => {
  const { data: users, isLoading } = useFindUsersWithConversationsBadgeQuery();
  console.log(users);

  return (
    <Page display="flex">
      <Sidebar>
        {isLoading
          ? "Loading ..."
          : users
          ? users.map((u) => (
              <Link
                key={u.id}
                href={`/profile/${u.profile?.id}`}
                className={styles.item}
              >
                <img
                  style={{ borderRadius: "50%", width: "60px", height: "60px" }}
                  src={
                    u.profile?.avatarUrl ||
                    "https://static.vecteezy.com/system/resources/previews/036/280/651/large_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
                  }
                  alt="avatar"
                />
                <div>
                  <p>{`${u.firstName} ${u.lastName}`}</p>
                  <p>{u.email}</p>
                </div>
              </Link>
            ))
          : "no users"}
      </Sidebar>
    </Page>
  );
};

export default UsersPage;
