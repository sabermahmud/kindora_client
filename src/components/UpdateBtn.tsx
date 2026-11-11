import { FaArrowRight } from "react-icons/fa";

export default function UpdateBtn() {
  const handleUpdate = async () => {
    console.log(`update btn clicked`);
  };
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        onClick={()=>document.getElementById('my_modal_1').showModal()}
        className="group/button inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#245C45] py-5 text-sm font-medium text-white transition-colors hover:bg-[#194936] dark:bg-green-600 dark:hover:bg-green-700"
      >
        Update
        <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}



