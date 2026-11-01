export interface CreateEventPageProps {
    prop: string
}

export default function CreateEventPage({ prop }: CreateEventPageProps) {
    
    return <>
    <div>
        <h2>Create New Event</h2>
        <p>Share your initiative with the Kindora community.</p>
        <div>
            <h2>Basic Information</h2>
            <form>
                {/* event */}
               <label htmlFor="title">
                EVENT TITLE
               </label>
               <input type="text" name="title" placeholder="exp:Tree Plantation Campaign 2026 " />

               {/* category */}
               <label htmlFor="category">
                CATEGORY
               </label>
               <input type="text" name="category" placeholder="exp:Environment" />

                {/* description */}
               <label htmlFor="description">
                DESCRIPTION
               </label>
               <textarea name="description" placeholder="exp:Describe your event..." />

                {/* cover image */}
               <label htmlFor="cover_image">
                COVER IMAGE
               </label>
               <input type="text" name="cover_image" placeholder="exp:Environment" />


            </form>
        </div>
    </div>
    </>
}