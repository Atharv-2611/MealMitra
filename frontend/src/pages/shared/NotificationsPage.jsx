import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  UtensilsCrossed,
  Info
} from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useDonations();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'claim':
        return <UtensilsCrossed className="w-4 h-4 text-[#533afd]" />;
      case 'food_available':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-[#64748d]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e3e8ee] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            Notifications & System Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
            Stay updated on real-time food claims, pickup schedules, and compliance reminders.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="subtle"
            size="sm"
            onClick={markAllAsRead}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#f6f9fc] border border-[#e3e8ee] rounded-full max-w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-white text-[#533afd] shadow-xs'
              : 'text-[#64748d] hover:text-[#0d253d]'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-white text-[#533afd] shadow-xs'
              : 'text-[#64748d] hover:text-[#0d253d]'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List Container */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 divide-y divide-[#e3e8ee] overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-normal text-[#0d253d]">
              No notifications to display
            </h3>
            <p className="text-xs text-[#64748d] max-w-sm mx-auto font-light">
              You are completely caught up! New donation and pickup notifications will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex items-start gap-4 transition-colors ${
                notif.read ? 'bg-white' : 'bg-[#eef0ff]/30'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-white border border-[#e3e8ee] shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-medium text-[#0d253d] flex items-center gap-2">
                    <span>{notif.title}</span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#533afd] inline-block"></span>
                    )}
                  </h4>
                  <span className="text-[11px] text-[#64748d] shrink-0 tnum font-light">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#273951] leading-relaxed font-light mb-2">
                  {notif.message}
                </p>

                <div className="flex items-center gap-3">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-[#533afd] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-[11px] text-[#64748d] hover:text-[#0d253d] cursor-pointer"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
