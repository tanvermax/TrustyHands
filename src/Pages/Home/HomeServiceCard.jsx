import { Link } from "react-router-dom";

export const HomeServiceCard = ({ card, day, userArea }) => {

   



  return (
    <div
      className={`bg-gradient-to-br from-[#fafafa] to-[#5f615f44] rounded-2xl p-4 shadow-xl transition-all duration-300 `}
    >
      <div className="relative overflow-hidden rounded-xl">
        <img
          className="w-full h-60 object-cover rounded-xl border border-gray-700"
          src={card.imageUrl}
          alt={card.serviceName}
        />
        <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {card.serviceArea}
        </div>
        <div className="absolute top-3 right-3 bg-primary  text-sm font-semibold px-3 py-1 rounded-full">
          ${card.price}
        </div>
      </div>

      <div className="mt-4 px-1">
        <h3 className="text-lg font-bold  truncate">
          {card.serviceName}
        </h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
          {card.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full border-2 border-primary"
              src={card.providerphoto}
              alt={card.providername}
            />
            <span className="text-sm text-gray-300">{card.providername}</span>
          </div>
        </div>

       
          <Link to={`/addservice/${card._id}`}>
            <button className="w-full mt-5 bg-primary  py-2 rounded-xl font-semibold hover:bg-primary-dark transition">
              View Details
            </button>
          </Link>
       
      </div>
    </div>
  );
};
