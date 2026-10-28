export function CityPoster() {
  return (
    <figure className="city-poster" aria-hidden="true">
      <svg viewBox="0 0 900 570" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="window-grid"
            x="0"
            y="0"
            width="47"
            height="61"
            patternUnits="userSpaceOnUse"
          >
            <path d="M13 12h15v29H13z" fill="#f0e1c7" />
          </pattern>
          <pattern
            id="print-grain"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="3" r=".55" fill="#382f25" opacity=".11" />
            <circle cx="4" cy="1" r=".35" fill="#382f25" opacity=".08" />
          </pattern>
          <clipPath id="poster-shape">
            <path d="M40 520V287C40 145 166 30 345 30H807V520Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#poster-shape)">
          <path d="M0 0h900v570H0z" fill="#e6d9bf" />
          <circle cx="668" cy="142" r="88" fill="#b85a35" />
          <path
            d="M-30 412c140-90 300-148 490-119s345-60 470-143v420H-30Z"
            fill="#c6c1a0"
          />
          <path d="M45 355 187 262 340 357v185H45Z" fill="#8a8b62" />
          <path
            d="m27 355 160-111 171 111h-36l-135-86L62 355Z"
            fill="#454c37"
          />
          <path
            d="M77 388h42v71H77zm81 0h42v71h-42zm80 0h42v71h-42z"
            fill="#eddfc4"
          />
          <path
            d="M77 418h42m39 0h42m38 0h42"
            stroke="#8a8b62"
            strokeWidth="5"
          />
          <path d="M173 542v-53a28 28 0 0 1 56 0v53" fill="#414935" />
          <path d="M307 177h178v365H307z" fill="#c78350" />
          <path d="M297 162h198v20H297z" fill="#6d4933" />
          <path d="M322 194h149v195H322z" fill="url(#window-grid)" />
          <path d="M320 451h153v91H320z" fill="#f0e1c7" />
          <path d="M396 451v91" stroke="#6d4933" strokeWidth="5" />
          <path d="M310 408h173l14 44H296Z" fill="#a64f31" />
          <path
            d="m326 408-9 44m40-44-5 44m37-44-1 44m35-44 3 44m28-44 10 44"
            stroke="#f1e3cc"
            strokeWidth="17"
          />
          <path d="M496 542V281l108-78 121 78v261Z" fill="#d0b78d" />
          <path d="m479 281 125-98 141 98h-36l-105-72-94 72Z" fill="#6d4933" />
          <path
            d="M530 333v-22a26 26 0 0 1 52 0v22zm85 0v-22a26 26 0 0 1 52 0v22z"
            fill="#f1e4cb"
          />
          <path d="M530 356h52v58h-52zm85 0h52v58h-52z" fill="#f1e4cb" />
          <path d="M552 542v-63a39 39 0 0 1 78 0v63" fill="#8c7050" />
          <path d="M591 441v101" stroke="#cbb28b" strokeWidth="4" />
          <path d="M0 516h900v54H0Z" fill="#bca583" />
          <path d="M727 542V338" stroke="#454c37" strokeWidth="11" />
          <ellipse cx="727" cy="325" rx="65" ry="92" fill="#666e46" />
          <path
            d="M727 258v191m0-81 38-43m-38 80-38-42"
            stroke="#d0c7a5"
            strokeWidth="4"
          />
          <path d="M58 542V450" stroke="#454c37" strokeWidth="7" />
          <ellipse cx="58" cy="443" rx="31" ry="49" fill="#626c44" />
          <path d="M40 0h800v570H40z" fill="url(#print-grain)" />
        </g>
        <path d="M28 539H825" stroke="#766248" strokeWidth="1.5" />
        <path
          d="m838 299 4 25 21 13-25 4-14 22-3-25-23-13 26-4Z"
          fill="#b14e2c"
        />
        <path d="m211 106 5 13 14 4-14 4-5 14-4-14-14-4 14-4Z" fill="#6d4933" />
        <path
          d="M773 88q13-17 27 0m-245-16q11-13 22 0"
          stroke="#766248"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <figcaption>
        <span>A LITTLE FAMILIAR</span>
        <span>WHEREVER YOU LAND.</span>
      </figcaption>
    </figure>
  );
}
