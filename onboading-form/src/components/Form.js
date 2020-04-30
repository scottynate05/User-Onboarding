import React, { useState, useEffect } from "react";
import * as yup from "yup";
import Axios from "axios";
import axios from "axios";

export default function() {
    const [post, setPost] = useState([]);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        terms: ""
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        terms: ""
    });

    const formSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup
            .string()
            .email("Must be a valid email address")
            .required(),
        password: yup
                .string()
                .required('Password is required')
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                ),
        passwordConfirmation: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match'),
        terms: yup.boolean().oneOf([true], "Please see terms and Sevices")
    })

    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.value)
            .then(valid => {
                setErrors({ ...errors, [e.target.name]: "" });
            })
            .catch(err => {
                console.log("Error!", err);
                setErrors({ ...errors, [e.target.name]: err.errors[0] });
            })
    }

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            console.log("Valid?", valid)
            setIsButtonDisabled(!valid)
        });
    }, [formState]);

    const formSubmit = e => {
        e.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then(response => {
                setPost(response.data);
                setFormState({
                    name: "",
                    email: "",
                    password: "",
                    passwordConfirmation: "",
                    terms: ""
                })
            })
            .catch(err => console.log(err.response))
        console.log("Form submitted!")
    }

    const inputChange = e => {
        console.log("Input Changed!", e.target.value)
        e.persist()
        const newFormData = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
        }
        validateChange(e)
        setFormState(newFormData)
    }

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor="name">
                Name: 
                <input
                    id="name"
                    type="text"
                    name="name"
                    onChange={inputChange}
                    value={formState.name}
                />
                {errors.name.length > 0 ? <p className="error">{"errors.name"}</p> : null}
            </label>
            <label htmlFor="email">
                Email: 
                <input
                    type="email"
                    name="email"
                    onChange={inputChange}
                    value={formState.email}
                />
                {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>
            <label htmlFor="password">
                Password: 
                <input
                    type="password"
                    name="password"
                    onChange={inputChange}
                    value={formState.password}
                />
                {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
            </label>
            <label htmlFor="passwordConfirmation">
                Confirm Password: 
                <input
                    type="password"
                    name="passwordConfirmation"
                    onChange={inputChange}
                    value={formState.passwordConfirmation}
                />
                {errors.passwordConfirmation.length > 0 ? <p className="error">{errors.passwordConfirmation}</p> : null}
            </label>
            <label htmlFor="terms" className="terms">
                <input
                    type="checkbox"
                    name="terms"
                    checked={formState.terms}
                    onChange={inputChange}
                />
                Terms & Services
            </label>
            <pre>{JSON.stringify(post, null, 2)}</pre>
            <button disabled={isButtonDisabled} type="submit">
                Submit
            </button>
        </form>
    )

}