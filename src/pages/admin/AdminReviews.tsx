import { useEffect, useState } from 'react';
import { Check, X, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/utils';
import StarRating from '../../components/StarRating';
import type { Review, Product } from '../../lib/types';

export default function AdminReviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<(Review & { product?: Product })[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const load = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false });
    setReviews(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  const approve = async (id: string) => {
    const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    if (error) { showToast('Failed to approve', 'error'); return; }
    showToast('Review approved');
    load();
  };

  const unapprove = async (id: string) => {
    const { error } = await supabase.from('reviews').update({ is_approved: false }).eq('id', id);
    if (error) { showToast('Failed to update', 'error'); return; }
    showToast('Review hidden');
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Review deleted');
    load();
  };

  const reply = async (id: string, replyText: string) => {
    const { error } = await supabase.from('reviews').update({ admin_reply: replyText }).eq('id', id);
    if (error) { showToast('Failed to save reply', 'error'); return; }
    showToast('Reply saved');
    load();
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink-900">Reviews</h1>

      <div className="mb-4 flex gap-2">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">
              ({f === 'all' ? reviews.length : f === 'pending' ? reviews.filter((r) => !r.is_approved).length : reviews.filter((r) => r.is_approved).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={approve}
              onUnapprove={unapprove}
              onDelete={handleDelete}
              onReply={reply}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 py-16 text-center">
          <MessageSquare size={32} className="mx-auto mb-3 text-ink-300" />
          <p className="text-ink-400">No reviews found.</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  review, onApprove, onUnapprove, onDelete, onReply,
}: {
  review: Review & { product?: Product };
  onApprove: (id: string) => void;
  onUnapprove: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (id: string, reply: string) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState(review.admin_reply ?? '');

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <StarRating rating={review.rating} />
            <span className="text-sm font-medium text-ink-900">{review.customer_name}</span>
            {!review.is_approved && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Pending</span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-500">
            on {review.product?.name ?? 'Unknown product'} · {formatDate(review.created_at)}
          </p>
        </div>
        <div className="flex gap-1">
          {review.is_approved ? (
            <button onClick={() => onUnapprove(review.id)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100" title="Hide">
              <X size={16} />
            </button>
          ) : (
            <button onClick={() => onApprove(review.id)} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50" title="Approve">
              <Check size={16} />
            </button>
          )}
          <button onClick={() => setShowReply(!showReply)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100" title="Reply">
            <MessageSquare size={16} />
          </button>
          <button onClick={() => onDelete(review.id)} className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {review.title && <h4 className="mt-3 font-semibold text-ink-900">{review.title}</h4>}
      {review.body && <p className="mt-1 text-sm text-ink-600">{review.body}</p>}
      {review.admin_reply && !showReply && (
        <div className="mt-3 rounded-lg bg-ink-50 p-3">
          <span className="text-xs font-semibold text-gold-600">Admin Reply:</span>
          <p className="mt-1 text-sm text-ink-600">{review.admin_reply}</p>
        </div>
      )}
      {showReply && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="input-field text-sm"
          />
          <button
            onClick={() => { onReply(review.id, replyText); setShowReply(false); }}
            className="shrink-0 rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
