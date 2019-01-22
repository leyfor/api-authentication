const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
     return (req, res, next) => {
         const result = Joi.validate(req.body, schema);
         if (result.error) {
             return res.status(400).json(result.error);
         }
         if (!req.value) {
             req.value = {};
         }
         req.value['body'] = result.value;
         next();
     }
    },
    schemas: {
        authSchema: Joi.object().keys({
            method: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
}



/* 
{
  "access_token": "ya29.GluYBhl9gaQxY47Lxy-EqIKDla-3jW3Uf1EL0717ek0K0E57oXeFgvUr4UvkNsVvSWZeuKfelEeoKBRgMsw7apzFfwY8SXVqjjEXqtlmX5GNXwOaREnsKdOg1Wy0", 
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA4ZDMyNDVjNjJmODZiNjM2MmFmY2JiZmZlMWQwNjk4MjZkZDFkYzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQyMzcyNDM0MDA5NTQxMTQ2NjkiLCJlbWFpbCI6Imp1c3RtYW41MTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJDNDIyWEpYVndIeWQ4NWdzQlQ1UnVBIiwibmFtZSI6Imp1c3RtYW41MSIsInBpY3R1cmUiOiJodHRwczovL2xoNS5nb29nbGV1c2VyY29udGVudC5jb20vLVZ2ZXI3c0pyTVBBL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FLeHJ3Y1lSblJuRkgybVpUcEppTkwyeUFlOGdyczhzVEEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6Imp1c3RtYW41MSIsImZhbWlseV9uYW1lIjoiLiIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTQ4MDk0MjgzLCJleHAiOjE1NDgwOTc4ODN9.QJBxnLC04NEv1ZvDCEiAscuq0bHUYWvwArbu6ZUxlKX1fgxicVemTK7czDK9zVCIAFOiJJvnh-HylmjCbkuJkyF5JpILJIFqkKgKSC6P8l9ZlMLnhodRI5q6yB5N8Dl5K2QOnavi8WKiqGnJwnlsEUlMLU6p6_nJV9Ki6Ic4VaFJu2h3YspNsM1JmaTRxq1EFqTAuOE7KndSQbdlqk9j3ZW9opb-JjjQA7Qfa562Jo-tkjq1GsWoxj34VaPP05KUuH2c9E2XSntg13SUhbPUK1zpcj4KwXKdr0bEDYzyO2fv9wwO1VfbnFE6XwRoubFEyHBB5TBG-cUFeRr8H7_lwQ", 
  "expires_in": 3600, 
  "token_type": "Bearer", 
  "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email", 
  "refresh_token": "1/mo0Twold5gkzosmUdygh9S3bDxXLvGxthpLzAoaKWDGcC79LLRFb8llaG6p1VCD1"
}
*/