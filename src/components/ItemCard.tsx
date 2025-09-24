import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import type { PriceHistory } from "../types/priceHistory";
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  type ChartOptions,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale);


export interface ItemCardProps {
  id: string;
  itemImageUrl: string;
  itemName: string;
  barcode?: string;
  description: string;
  category: string;
  storeName: string;
  isDiscount: boolean;
  itemPrice: number;
  discountedPrice?: number;
  priceHistory?: PriceHistory[];
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  itemImageUrl,
  itemName,
  barcode,
  description,
  category,
  storeName,
  isDiscount,
  itemPrice,
  discountedPrice,
  priceHistory
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit-item/${id}`);
  };

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? `${price}` : `${price.toFixed(2)}` 
  }

  let sortedHistory = Array.isArray(priceHistory)
    ? [...priceHistory]
      .filter(h => h && h.changedAt && h.price !== undefined)
      .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime())
    : [];
  
  if (sortedHistory.length > 0) {
    const last = sortedHistory[sortedHistory.length - 1];
    const lastDate = new Date(last.changedAt);
    const today = new Date();
    lastDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (lastDate.getTime() < today.getTime()) {
      sortedHistory = [
        ...sortedHistory,
        {
          ...last,
          id: last.id + '-virtual',
          changedAt: today.toISOString(),
        }
      ];
    }
  }
  
  const chartData = {
    datasets: [
      {
        label: 'Price',
        data: sortedHistory.map(h => ({
          x: h.changedAt,
          y: h.discountedPrice !== undefined && h.discountedPrice !== null
            ? h.discountedPrice
            : h.price
        })),
        fill: false,
        borderColor: '#c8ff00',
        backgroundColor: '#c8ff00',
        tension: 0.2,
        stepped: 'before' as const,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const yValue = (context.raw as { x: any; y: number }).y;
            return `$${formatPrice(yValue)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'Pp',
          displayFormats: {
            day: 'MM/dd/yy',
          },
        },
        title: { display: false },
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#FFF", maxTicksLimit: 4}
      },
      y: {
        title: { display: true, text: 'Price', color: "#FFF" },
        grid: { display: false },
        border: { display: false },
        ticks: {
          callback: function(value) {
          return `${formatPrice(Number(value))}`;
        },
          color: "#FFF"
        }
      },
    },
  };

    return (
        <div className="item-card">
            <img src={itemImageUrl} alt={itemName}/>
            <h2>{itemName}</h2>
            <div className="item-barcode">{barcode}</div>
            <p>{description}</p>
            <div className="item-category">{category}</div>
            <div className="item-store">{storeName}</div>
            <div className="item-price">
              {isDiscount && discountedPrice !== undefined ? (
                  <div>
                  <p>${formatPrice(discountedPrice)}</p>
                  <s>${formatPrice(itemPrice)}</s>
                  </div> 
              ) : (
                  <p>${formatPrice(itemPrice)}</p>
              )}
            </div>
            <button className="button edit-button" onClick={handleEditClick}>
                <FontAwesomeIcon icon={faPencilAlt} /> Edit
            </button>

          {Array.isArray(priceHistory) && priceHistory.length > 0 && (
            <div className="price-history">
            <h4>Price History</h4>
              {sortedHistory.length > 0 && (
                <div className="price-history-graph">
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}
              <table className="price-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[...priceHistory]
                    .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime())
                    .map((h) => (
                      <tr key={h.id}>
                      <td>
                        {new Date(h.changedAt).toLocaleDateString(undefined, {
                          year: '2-digit',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td>
                        {h.discountedPrice !== undefined && h.discountedPrice !== null
                          ? (
                            <span>${formatPrice(h.discountedPrice)}</span>
                          ) : (
                            <span>${formatPrice(h.price)}</span>
                          )}
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}
        </div>
    )
}

export default ItemCard;