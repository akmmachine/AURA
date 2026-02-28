import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

interface BlogProps {
  posts: BlogPost[];
}

const BLOG_CATEGORIES = ['All', 'Design', 'Sustainability', 'Culture', 'Behind the Scenes', 'Style Guide'] as const;

const Blog: React.FC<BlogProps> = ({ posts }) => {
  const { id } = useParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  const publishedPosts = posts.filter(p => p.published).sort((a, b) => (b.date > a.date ? 1 : -1));
  const filtered = activeCategory === 'All' ? publishedPosts : publishedPosts.filter(p => p.category === activeCategory);

  if (id) {
    const post = publishedPosts.find(p => p.id === id);
    if (!post) {
      return (
        <div className="pt-40 pb-20 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Post not found</p>
          <Link to="/blog" className="text-[10px] font-bold text-black uppercase tracking-widest border-b border-black pb-1">Back to Journal</Link>
        </div>
      );
    }

    return (
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/blog" className="inline-flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-black transition-colors mb-12">
          <ArrowLeft size={14} className="mr-2" /> Back to Journal
        </Link>

        {post.coverImage && (
          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-slate-100">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full mb-6 border border-slate-100">
          <Tag size={10} className="inline mr-1.5 -mt-px" />{post.category}
        </span>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase italic mb-6 leading-[0.95]">{post.title}</h1>

        <div className="flex items-center space-x-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-16 pb-8 border-b border-slate-100">
          <span className="flex items-center"><User size={12} className="mr-1.5" />{post.author}</span>
          <span className="flex items-center"><Calendar size={12} className="mr-1.5" />{post.date}</span>
        </div>

        <article className="prose-aura">
          {post.body.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-sm leading-[2] text-slate-600 font-light mb-6">{paragraph}</p>
          ))}
        </article>

        <div className="mt-20 pt-12 border-t border-slate-100 text-center">
          <Link to="/blog" className="text-[10px] font-bold text-black uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity">
            Read more from the Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-12 h-px bg-black"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-slate-400">AURA // JOURNAL</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic mb-4">The Journal</h1>
          <p className="text-sm font-light text-slate-500 uppercase tracking-widest max-w-lg">
            Reflections on design, sustainability, and the philosophy of intentional living.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-16">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${activeCategory === cat ? 'bg-black text-white border-black' : 'bg-white border-slate-200 text-slate-500 hover:border-black hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group block"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-6 border border-slate-100">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200 text-6xl font-serif italic">A</div>
                  )}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">{post.category} · {post.date}</span>
                <h3 className="text-lg font-bold tracking-tight uppercase mb-2 group-hover:underline underline-offset-4">{post.title}</h3>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
