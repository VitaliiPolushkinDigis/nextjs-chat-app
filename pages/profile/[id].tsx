import { Button } from "@mui/material";
import { useFormik } from "formik";
import { FC, useContext, useEffect } from "react";

import { useAppDispatch, useTypedSelector } from "@/redux";
import {
  useCreatePostMutation,
  useGetProfilePostsQuery,
  useLazyGetProfileQuery,
} from "@/utils/api";
import { useParams } from "next/navigation";
import Post from "../../components/Post/Post";
import TextFieldComponent from "../../components/TextFieldComponent/TextFieldComponent";
import Page from "../../components/layouts/page/Page";
import styles from "../../components/Profile/Profile.module.css";
import { AuthContext } from "@/utils/context/AuthContext";
import Image from "next/image";
import { useToasts } from "react-toast-notifications";
import Loader from "@/components/Loader/Loader";

interface PostsProps {
  id: number;
}

const Posts: FC<PostsProps> = ({ id }) => {
  const { data, isLoading } = useGetProfilePostsQuery(id);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        data
          ?.slice()
          ?.sort((a, b) => (a?.id > b?.id ? -1 : 1))
          ?.map((p) => <Post key={p.id} p={p} />) || <p>No posts yet</p>
      )}
    </>
  );
};

interface ProfilePageProps {}

const ProfilePage: FC<ProfilePageProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToasts();
  const { user } = useContext(AuthContext);

  const params = useParams();
  const id = params?.id;

  const [createPost, resulr] = useCreatePostMutation();

  const [getProfile, profile] = useLazyGetProfileQuery();

  const {
    values,
    handleChange,
    handleBlur,
    setFieldTouched,
    errors,
    handleSubmit,
  } = useFormik({
    initialValues: { title: "", description: "", subtitle: "", imgUrl: "" },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: false,

    onSubmit: (values, actions) => {
      createPost({
        ...values,
        likes: 0,
        imgUrl:
          values.imgUrl ||
          "https://techcrunch.com/wp-content/uploads/2022/06/instagram-pin-posts.png",
      })
        .then(
          () => {
            addToast("Created!");
            actions.resetForm({});
          },
          (r) => addToast(`Error creating a post ${r}`)
        )
        .catch((err) => {
          addToast(`Not successfull! ${err}`);
        });
    },
  });

  useEffect(() => {
    if (id) getProfile(id);
  }, [dispatch, id]);
  console.log("profile.data", profile.data, user);

  return (
    <Page>
      <div className={styles.profileWrapper}>
        <div className={styles.content}>
          {profile && (
            <div className={styles.mainContent}>
              <div className={styles.profileInfo}>
                <Image
                  className={styles.avatar}
                  src={
                    profile?.data?.avatarUrl ||
                    "https://i.pinimg.com/564x/15/e7/7e/15e77e7a76cbf41f029acf220059ce26.jpg"
                  }
                  alt="avatar"
                  width={200} // Set the width of the avatar
                  height={200} // Set the height of the avatar
                />
                <div>
                  <p style={{ textTransform: "capitalize", fontSize: "28px" }}>
                    {profile?.data?.user.firstName}{" "}
                    {profile?.data?.user.lastName}
                  </p>
                  <div style={{ marginLeft: "16px" }}>
                    <p>Birth-Day: {profile?.data?.birthDay}</p>
                    <p>City: {profile?.data?.city}</p>
                    <p>Country: {profile?.data?.country}</p>
                  </div>
                </div>
              </div>
              <div>
                {profile.data?.id === user?.id && (
                  <form
                    onSubmit={handleSubmit}
                    data-attr="form"
                    style={{
                      marginTop: "32px",
                      filter: "drop-shadow(#378158 0px 5px 6px)",
                    }}
                  >
                    <p style={{ fontSize: "24px", marginBottom: "16px" }}>
                      What Would You Like to Share?
                    </p>
                    <TextFieldComponent
                      placeholder="Post title"
                      name="title"
                      value={values.title ? values.title : ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      setFieldTouched={setFieldTouched}
                      errorText={errors.title}
                      fullWidth
                      helperText
                      label="Post Title"
                    />
                    <TextFieldComponent
                      placeholder="Your Subtitle"
                      name="subtitle"
                      value={values.subtitle || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      setFieldTouched={setFieldTouched}
                      errorText={errors.subtitle}
                      fullWidth
                      helperText
                      label="Your Subtitle"
                    />
                    <TextFieldComponent
                      placeholder="Your Description"
                      name="description"
                      value={values.description || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      setFieldTouched={setFieldTouched}
                      errorText={errors.description}
                      fullWidth
                      helperText
                      label="Your Description"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      data-attr="submit"
                      sx={{ marginTop: "20px" }}
                    >
                      Create a new post
                    </Button>
                  </form>
                )}

                {id && (
                  <div style={{ marginTop: "40px" }}>
                    <h2
                      style={{
                        textTransform: "capitalize",
                        marginBottom: "16px",
                      }}
                    >
                      {profile.data?.user.firstName}'s posts:
                    </h2>
                    <Posts id={parseInt(id as string)} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;
