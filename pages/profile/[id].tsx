import { Box, Button, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FC, useEffect } from "react";

import { useAppDispatch, useTypedSelector } from "@/redux";
import { getAuth } from "@/redux/slices/userSlice";
import { useGetProfilePostsQuery, useLazyGetProfileQuery } from "@/utils/api";
import { UserWithoutPassword } from "@/utils/types";
import { useParams, useRouter } from "next/navigation";
import Post from "../../components/Post/Post";
import TextFieldComponent from "../../components/TextFieldComponent/TextFieldComponent";
import Page from "../../components/layouts/page/Page";

/* import { useAuth } from '../../hooks/useAuth'; */

interface PostsProps {
  id: number;
}

const Posts: FC<PostsProps> = ({ id }) => {
  const { data } = useGetProfilePostsQuery(id);

  return (
    <>
      {data?.map((p) => <Post key={p.id} p={p} />) || (
        <Typography>No posts yet</Typography>
      )}
    </>
  );
};

interface ProfilePageProps {}

const ProfilePage: FC<ProfilePageProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.user);

  const params = useParams();
  const id = params?.id;

  /*  const [createPost, resulr] = useCreatePostMutation(); */

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
      /*      createPost({
        ...values,
        likes: 0,
        imgUrl:
          values.imgUrl ||
          "https://techcrunch.com/wp-content/uploads/2022/06/instagram-pin-posts.png",
      }).then(() => {
        actions.resetForm({});
      }); */
    },
  });

  useEffect(() => {
    if (id) getProfile(id);
  }, [dispatch, id]);

  return (
    <Page>
      <Grid
        container
        direction="row"
        style={{ flexWrap: "inherit", margin: "0 auto", width: "80%" }}
      >
        <Box style={{ width: "100%" }}>
          {profile && (
            <Box style={{ display: "flex" }}>
              <Box>
                <img
                  style={{ borderRadius: "50%", width: "200px" }}
                  src={profile?.data?.avatarUrl}
                  alt="avatar"
                />
              </Box>
              <Box>
                <Typography>
                  {user?.firstName} {user?.lastName}
                </Typography>
                {
                  profile?.data?.status ? (
                    <Typography>{profile?.data?.status}</Typography>
                  ) : null /* (
                  <TextFieldComponent
                    placeholder="Your Status"
                    name="text"
                    value={values.text ? values.text : ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    setFieldTouched={setFieldTouched}
                    errorText={errors.text}
                    fullWidth
                    helperText
                    label="Your Status"
                    dataAttr="text"
                  profileData/>
                ) */
                }

                <form onSubmit={handleSubmit} data-attr="form">
                  <Typography>create your post</Typography>
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
                  >
                    Create a new post
                  </Button>
                </form>

                {id && (
                  <Box style={{ marginTop: "40px" }}>
                    <Posts id={parseInt(id as string)} />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
    </Page>
  );
};

export default ProfilePage;
