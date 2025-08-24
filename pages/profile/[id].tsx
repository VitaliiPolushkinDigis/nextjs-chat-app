import { Button } from "@mui/material";
import { useFormik } from "formik";
import { FC, useContext, useEffect, useState } from "react";

import { useAppDispatch, useTypedSelector } from "@/redux";
import {
  useCreatePostMutation,
  useGetProfilePostsQuery,
  useLazyGetProfileQuery,
  useSendDMMutation,
  useGetInstagramProfilesQuery,
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
  const [selectedInstagramProfileId, setSelectedInstagramProfileId] = useState<number | null>(null);

  const params = useParams();
  const id = params?.id;

  const [createPost, resulr] = useCreatePostMutation();
  const [sendDM, result] = useSendDMMutation();
  const { data: instagramProfiles } = useGetInstagramProfilesQuery();

  const [getProfile, profile] = useLazyGetProfileQuery();

  // Load selected Instagram profile ID from localStorage
  useEffect(() => {
    const storedProfileId = localStorage.getItem('selectedInstagramProfileId');
    if (storedProfileId) {
      setSelectedInstagramProfileId(Number(storedProfileId));
    }
  }, []);

  const handleInstagramProfileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profileId = Number(e.target.value);
    setSelectedInstagramProfileId(profileId);
    localStorage.setItem('selectedInstagramProfileId', profileId.toString());
  };

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
            
            // Only send Instagram DM if a profile is selected
            if (selectedInstagramProfileId) {
              sendDM({
                profileId: selectedInstagramProfileId,
                recipientId: '708149675552701',
                message: values.title || 'Hello, how are you?',
              }).then(
                () => addToast("Instagram DM sent successfully!"),
                (error) => addToast(`Failed to send Instagram DM: ${error}`)
              );
            } else {
              addToast("No Instagram profile selected - skipping DM");
            }
            
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
                    
                    {/* Instagram Profile Selection */}
                    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                      <label 
                        htmlFor="instagramProfile" 
                        style={{ 
                          display: "block", 
                          marginBottom: "8px", 
                          fontWeight: "500",
                          color: "#495057"
                        }}
                      >
                        Instagram Profile (for DM):
                      </label>
                      <select
                        id="instagramProfile"
                        value={selectedInstagramProfileId || ""}
                        onChange={handleInstagramProfileSelect}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e9ecef",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          backgroundColor: "white",
                          cursor: "pointer"
                        }}
                      >
                        <option value="">-- Select Instagram Profile --</option>
                        {instagramProfiles?.map((profile: any) => (
                          <option key={profile.id} value={profile.id}>
                            @{profile.username} ({profile.instagramBusinessAccountId})
                          </option>
                        ))}
                      </select>
                      {!selectedInstagramProfileId && (
                        <small style={{ color: "#6c757d", fontStyle: "italic" }}>
                          No profile selected - Instagram DM will be skipped
                        </small>
                      )}
                    </div>

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

                {id && user?.id && (
                  <div style={{ marginTop: "40px" }}>
                    <h2
                      style={{
                        textTransform: "capitalize",
                        marginBottom: "16px",
                      }}
                    >
                      {profile.data?.user.firstName}&apos;s posts:
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
