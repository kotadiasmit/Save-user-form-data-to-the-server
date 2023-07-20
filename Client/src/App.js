import { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import "./App.css";

const ValidationIcon = ({ valid }) =>
  valid ? (
    <AiFillCheckCircle className="input-icon success" />
  ) : (
    <AiFillExclamationCircle className="input-icon error" />
  );

const initialFormData = {
  username: "",
  email: "",
  password: "",
  password2: "",
  selectedFile: "",
};

const initialPasswordErrors = {
  length: false,
  uppercase: false,
  lowercase: false,
  digit: false,
  specialChars: false,
};

const FileUploader = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [passwordErrors, setPasswordErrors] = useState(initialPasswordErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    const checkFormInputs = checkInputs();
    if (checkFormInputs) {
      const fd = new FormData();
      fd.append("file", formData.selectedFile);
      fd.append("username", formData.username);
      fd.append("email", formData.email);
      fd.append("password", formData.password);
      fd.append("password2", formData.password2);

      try {
        console.log("processing");
        await axios.post("http://localhost:2000/submit-form", fd);
        console.log("done");
        alert("Form data submitted successfully.");
        setIsSubmitted(false);
        setFormData(initialFormData);
        document.getElementById("fileInput").value = "";
      } catch (error) {
        console.error("Error submitting form data:", error);
        alert("Failed to submit form data.");
      }
    } else {
      alert("Please fill form details");
    }
  };

  const checkInputs = () => {
    const { username, email, password, password2, selectedFile } = formData;
    const isUsernameValid = !!username;
    const isEmailValid = !!email && isEmail(email);
    const isPasswordValid = isPasswordStrong(password);
    const isPassword2Valid = !!password2 && password === password2;
    const isFileUploaded = !!selectedFile;
    console.log(isUsernameValid, isFileUploaded);
    if (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPassword2Valid &&
      isFileUploaded
    ) {
      return true;
    }
    return false;
  };

  const isEmail = (email) => {
    return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  };
  const isPasswordStrong = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+,.?:;<>=~])[a-zA-Z\d!@#$%^&*()_+,.?:;<>=~]{8,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    const { password } = formData;

    const passwordErrorsCopy = { ...passwordErrors };
    passwordErrorsCopy.length = password.length >= 8;
    passwordErrorsCopy.uppercase = /[A-Z]/.test(password);
    passwordErrorsCopy.lowercase = /[a-z]/.test(password);
    passwordErrorsCopy.digit = /\d/.test(password);
    passwordErrorsCopy.specialChars = /[!@#$%^&*()_+,.?:;<>=~]/.test(password);

    setPasswordErrors(passwordErrorsCopy);
  }, [formData.password]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFileChange = (event) => {
    const { files } = event.target;
    setFormData({ ...formData, selectedFile: files[0] });
  };

  const checkPassword = () => {
    if (isSubmitted && !passwordErrors.length) {
      return (
        <small className="error-message">
          Password must contain at least 8 characters.
        </small>
      );
    }
    if (isSubmitted && !passwordErrors.uppercase) {
      return (
        <small className="error-message">
          Password must have at least one uppercase letter.
        </small>
      );
    }
    if (isSubmitted && !passwordErrors.lowercase) {
      return (
        <small className="error-message">
          Password must have at least one lowercase letter.
        </small>
      );
    }
    if (isSubmitted && !passwordErrors.digit) {
      return (
        <small className="error-message">
          Password must have at least one digit.
        </small>
      );
    }
    if (isSubmitted && !passwordErrors.specialChars) {
      return (
        <small className="error-message">{`Password must include special characters (!@#$%^&*()_+,.?:;<>=~).`}</small>
      );
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create Account</h2>
      <form className="form" onSubmit={onFormSubmit}>
        <div className="form-sub-container">
          <label htmlFor="username">Username</label>
          <div
            className={classNames({
              "input-container": true,
              success: isSubmitted && !!formData.username,
              error: isSubmitted && !formData.username,
            })}
          >
            <input
              type="text"
              placeholder="coding_dev_"
              id="username"
              name="username"
              value={formData.username}
              onChange={onInputChange}
              className="input-field"
            />
            {isSubmitted && <ValidationIcon valid={formData.username !== ""} />}
          </div>

          {formData.username === "" && isSubmitted && (
            <small>Username cannot be blank</small>
          )}
        </div>
        <div className="form-sub-container">
          <label htmlFor="email">Email</label>
          <div
            className={classNames({
              "input-container": true,
              success:
                isSubmitted && !!formData.email && isEmail(formData.email),
              error:
                isSubmitted && (!!formData.email || !isEmail(formData.email)),
            })}
          >
            <input
              type="email"
              placeholder="example@gmail.com"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="input-field"
            />
            {isSubmitted && (
              <ValidationIcon
                valid={!!formData.email && isEmail(formData.email)}
              />
            )}
          </div>

          {formData.email === "" && isSubmitted ? (
            <small>Email cannot be blank</small>
          ) : !isEmail(formData.email) && isSubmitted ? (
            <small>Not a valid email</small>
          ) : null}
        </div>
        <div className="form-sub-container">
          <label htmlFor="password">Password</label>
          <div
            className={classNames({
              "input-container": true,
              success: isSubmitted && isPasswordStrong(formData.password),
              error: isSubmitted && !isPasswordStrong(formData.password),
            })}
          >
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              className="input-field"
            />
            {isSubmitted && (
              <ValidationIcon valid={isPasswordStrong(formData.password)} />
            )}
          </div>
          {checkPassword()}
        </div>
        <div className="form-sub-container">
          <label htmlFor="password2">Password check</label>
          <div
            className={classNames({
              "input-container": true,
              success:
                isSubmitted &&
                !!formData.password2 &&
                formData.password === formData.password2,
              error:
                isSubmitted &&
                (!formData.password2 ||
                  formData.password !== formData.password2),
            })}
          >
            <input
              type="password"
              placeholder="Password two"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={onInputChange}
              className="input-field"
            />
            {isSubmitted && (
              <ValidationIcon
                valid={
                  !!formData.password2 &&
                  formData.password === formData.password2
                }
              />
            )}
          </div>
          {!formData.password2 && isSubmitted ? (
            <small>Password2 cannot be blank</small>
          ) : formData.password !== formData.password2 && isSubmitted ? (
            <small>Passwords do not match</small>
          ) : null}
        </div>
        <div className="file-container">
          <input type="file" onChange={onFileChange} id="fileInput" />
          {!formData.selectedFile && isSubmitted && (
            <small>Please upload file</small>
          )}
        </div>
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FileUploader;
