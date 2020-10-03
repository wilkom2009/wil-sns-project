import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import AWS from "aws-sdk"

const AWSConf = require('../../config.json');
AWS.config.update(AWSConf);

export default function SubscribeForm() {
    const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
    }),

    onSubmit(values, { resetForm }) {
      const { email } = values
      var params = {
        Protocol: "EMAIL" /* required */,
        TopicArn: "arn:aws:sns:us-east-1:895272946407:GatsbyNewsletterTopic" /* required */,
        Endpoint: email,
      }

      var subscribePromise = new AWS.SNS({ apiVersion: "2010-03-31" })
        .subscribe(params)
        .promise()

      subscribePromise
        .then(function (data) {
          resetForm()
        })
        .catch(function (err) {
          console.error(err, err.stack)
        })
      
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Your email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      {formik.errors.email ? (
        <span className="errorText">{formik.errors.email}</span>
      ) : null}
      <input type="submit" value="Subscribe" />
    </form>
  )
}
