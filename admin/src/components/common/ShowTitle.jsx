const ShowTitle = ({ name }) => {
  return (
    <>
      <button class="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide transition duration-300 border rounded focus-visible:outline-none whitespace-nowrap border-white text-white hover:border-emerald-600 ">
        <span class="order-2">{name}</span>
        <span class="relative only:-mx-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
          </svg>
        </span>
      </button>
    </>
  );
};
export default ShowTitle;
