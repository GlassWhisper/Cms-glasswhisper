/** @type {import('tailwindcss').Config} */
export default {
     content: [
         "./index.html", "./src/**/*.{js,ts,jsx,tsx}"
     ],
     theme: {
          extend: {
               colors: {
                    "bg-register": "#523620",
                    button: "#7A3D12",
                    buttonSide: "rgba(122, 61, 18, 0.5)",
                    navColor: "#967259",
                    colorAbout: "#EFE2D6",
                    colorService: "#EAD0B8",
                    colorTeams: "background: #EFE2D6",
                    font : "#542200",
                    footer: "#C9A48A",
                    login: "rgba(169, 155, 144, 1)",
                    colorPlaceholder: "rgba(47, 47, 47, 0.35)"
               },
               fontFamily: {
                    'pociono': ['serif'],
               },
          },
     },
     plugins: [],
};
